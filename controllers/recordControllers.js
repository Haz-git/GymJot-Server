//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

//Controller Functions:

//Grabs a user's record data
exports.getUserRecordData = handleAsync(async (req, res, next) => {
    //Before designing this, check out the comment on addNewRecord. Maybe a redesign on just solely 'weights' and a lbs or kg selector will be better.
    res.status(200).json({
        message: 'This route grabs the user record data',
    });
});

//Adds a new record to stat:
exports.addNewRecord = handleAsync(async (req, res, next) => {
    //Maybe instead of lbs or kg, add weight. We'll need to keep all the weights in the backend in lbs format, and generate a rendered kg to the frontend.
    const { _id, email } = req.user;
    const { sets, reps, exerciseId } = req.body;
    let { weight, unit } = req.body;

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

    //If weight is in Kgs, calculate to lbs for storage.
    if (unit === 'Kgs') {
        weight = (weight * 2.20462).toFixed(2);
    }

    //Updating 'dateUpdated' value for stat:
    existingUser.userSavedStats[targetIndex][
        'dateUpdated'
    ] = existingUser.generateDateNow();

    //Adding object to array:

    existingUser.userSavedStats[targetIndex].records.push({
        sets,
        reps,
        weight,
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
    const { sets, reps, exerciseId, recordId } = req.body;
    let { weight, unit } = req.body;
    const { _id, email } = req.user;

    if (unit === 'Kgs') {
        weight = (weight * 2.20462).toFixed(2);
    }

    //Check if any of the values are undefined. If they are undefined, then do not update the values --> This means that the user does not want to update that values.

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const targetIndex = existingUser.findExerciseIndex(
        exerciseId,
        existingUser.userSavedStats
    );

    //Updating 'dateUpdated' value for stat:
    existingUser.userSavedStats[targetIndex][
        'dateUpdated'
    ] = existingUser.generateDateNow();

    const dateModified = existingUser.generateDateNow();

    const editedRecord = existingUser.findAndEditRecord(exerciseId, recordId, {
        sets,
        reps,
        weight,
        dateModified,
    });

    res.status(200).json({
        message: 'Record has successfully been added.',
        userSavedStats: editedRecord,
    });
});

exports.deleteRecord = handleAsync(async (req, res, next) => {
    const { exerciseId, recordId } = req.body;
    const { _id, email } = req.user;

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
