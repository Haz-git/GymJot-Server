/*
    This program exercise controller works with the program controller to perform CRUD operations for the exercises under each program.

*/

//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

//Controller Functions:

//Grabs a user's exercise data: This will be necessary if we route to a different page showing all the program's exercises.

exports.getAllProgramExercises = handleAsync(async (req, res, next) => {
    const { programId } = req.body;
    const { _id, email } = req.user;

    await User.findOne({
        _id: _id,
        email: email,
    }).then((user) => {
        const programTargetIndex = user.findProgramIndex(
            programId,
            user.userPrograms
        );

        res.status(200).json({
            message: 'User program exercises grabbed successfully.',
            userProgramExercises:
                user.userPrograms[programTargetIndex].programExercises,
        });
    });
});

//Adds a new program exercise to the user's program:

exports.addNewProgramExercise = handleAsync(async (req, res, next) => {
    //Create options to add certain weight and units, and percentage of a certain weight. How would we input a maxweight we can take a percentage of?
    const { programId, sets, reps, programExerciseName } = req.body;
    let { weight, unit, percentage, recentMaxWeight } = req.body;
    const { _id, email } = req.user;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const programTargetIndex = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    //We'll be using lbs for DB storage if weight is given with units of kg.

    if (unit === 'Kgs') {
        weight = (weight * 2.20462).toFixed(2);
    }

    existingUser.userPrograms[programTargetIndex].programExercises.push({
        programExerciseName,
        sets,
        reps,
        weight,
        percentage: percentage,
        recentMaxWeight: recentMaxWeight,
        dateAdded: existingUser.generateDateNow(),
        programExerciseId: existingUser.generateUuid(),
    });

    await User.updateOne(
        { _id: _id, email: email },
        { userPrograms: existingUser.userPrograms },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    const updatedUser = await User.findOne({ _id: _id, email: email }).select(
        'userPrograms'
    );

    res.status(200).json({
        msg: 'Program exercise has been added successfully.',
        userProgramExercise:
            updatedUser.userPrograms[programTargetIndex].programExercises,
    });
});
