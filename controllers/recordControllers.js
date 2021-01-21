//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

//Controller Functions:

//Grabs a user's record data
exports.getUserRecordData = handleAsync(async (req, res, next) => {
    res.status(200).json({
        message: 'This route grabs the user record data',
    });
});

//Adds a new record to stat:
exports.addNewRecord = handleAsync(async (req, res, next) => {
    //Maybe instead of lbs or kg, add weight.
    const { _id, email } = req.user;
    const { sets, reps, lbs, kgs, exerciseId } = req.body;

    //Find User

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    //Find Index for exercise:

    const targetIndex = existingUser.findExerciseIndex(
        exerciseId,
        existingUser.userSavedStats
    );

    //Adding object to array:

    existingUser.userSavedStats[targetIndex].records.push({
        sets,
        reps,
        lbs,
        kgs,
        dateModified: existingUser.generateDateNow(),
        recordId: existingUser.generateUuid(),
    });

    //Update the user.

    await User.updateOne(
        { _id: _id, email: email },
        { userSavedStats: existingUser.userSavedStats },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    //Find and send the updated user.

    const updatedUser = await User.findOne({ _id: _id, email: email }).select(
        'userSavedStats'
    );

    res.status(200).json({
        message: 'Record has successfully been added.',
        userSavedStats: updatedUser.userSavedStats,
    });
});

exports.editRecord = handleAsync(async (req, res, next) => {
    const { exerciseId, recordId, sets, reps, lbs, kgs } = req.body;
    const { _id, email } = req.user;

    res.status(200).json({
        message: 'Record has successfully been added.',
        // userSavedStats: updatedUser.userSavedStats,
    });
});

exports.deleteRecord = handleAsync(async (req, res, next) => {
    const { exerciseId, recordId } = req.body;
    const { _id, email } = req.user;

    console.log(exerciseId, recordId);

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const statDeleteIndex = existingUser.findExerciseIndex(
        exerciseId,
        existingUser.userSavedStats
    );

    const recordDeleteIndex = existingUser.findExerciseIndex(
        recordId,
        existingUser.userSavedStats[statDeleteIndex].records
    );

    existingUser.userSavedStats[statDeleteIndex].records.splice(
        recordDeleteIndex,
        1
    );

    //Update the user.

    await User.updateOne(
        { _id: _id, email: email },
        { userSavedStats: existingUser.userSavedStats },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    const updatedUser = await User.findOne({ _id: _id, email: email }).select(
        'userSavedStats'
    );

    res.status(200).json({
        message: 'Record has successfully been deleted',
        userSavedStats: updatedUser.userSavedStats,
    });
});
