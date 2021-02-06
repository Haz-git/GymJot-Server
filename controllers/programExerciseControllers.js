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
    let { weight, unit } = req.body;
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

//Controller function for deleting a program exercise:

exports.deleteProgramExercise = handleAsync(async (req, res, next) => {
    const { programId, programExerciseId } = req.body;
    const { _id, email } = req.user;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const targetProgram = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    //Find programExercise ID:

    const targetProgramExercise = existingUser.findProgramExerciseIndex(
        'programExerciseId',
        programExerciseId,
        existingUser.userPrograms[targetProgram].programExercises
    );

    existingUser.userPrograms[targetProgram].programExercises.splice(
        targetProgramExercise,
        1
    );

    //Update the user.

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
        msg: 'Program exercise has been successfully deleted.',
        userProgramExercises:
            updatedUser.userPrograms[targetProgram].programExercises,
    });
});

//Controller function for adding a new rest period:

exports.addNewRestPeriod = handleAsync(async (req, res, next) => {
    const { _id, email } = req.user;
    let { restLengthMinute, restLengthSecond, programId } = req.body;

    if (restLengthMinute === null || restLengthMinute === '') {
        restLengthMinute = '0';
    }

    if (restLengthSecond === null || restLengthSecond === '') {
        restLengthSecond = '0';
    }

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const programTargetIndex = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    existingUser.userPrograms[programTargetIndex].programExercises.push({
        programExerciseName: 'Rest Period',
        restLengthMinute,
        restLengthSecond,
        restId: existingUser.generateUuid(),
        dateAdded: existingUser.generateDateNow(),
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
        msg: 'Rest period has been added successfully.',
        userProgramExercises:
            updatedUser.userPrograms[programTargetIndex].programExercises,
    });
});

//Controller function for removing a rest period:

exports.deleteRestPeriod = handleAsync(async (req, res, next) => {
    const { _id, email } = req.user;
    const { programId, restId } = req.body;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const targetProgram = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    //Find programExercise ID:

    const targetProgramExercise = existingUser.findProgramExerciseIndex(
        'restId',
        restId,
        existingUser.userPrograms[targetProgram].programExercises
    );

    existingUser.userPrograms[targetProgram].programExercises.splice(
        targetProgramExercise,
        1
    );

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
        msg: 'Rest exercise has been deleted',
        userProgramExercises:
            updatedUser.userPrograms[targetProgram].programExercises,
    });
});

//This should add a rest period between each set of a program exercise:

exports.addRestPeriodsBetweenSets = handleAsync(async (req, res, next) => {
    const { _id, email } = req.user;
    const { programId, exerciseId } = req.body;

    let { restLengthMinute, restLengthSecond } = req.body;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const targetProgram = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    const targetProgramExercise = existingUser.findProgramExerciseIndex(
        'programExerciseId',
        exerciseId,
        existingUser.userPrograms[targetProgram].programExercises
    );

    //Add values into the targeted stored program exercises.

    //Add num rests for number of rests (sets - 1);

    const restNum = existingUser.findNumRestBetweenSets(
        targetProgram,
        targetProgramExercise
    );

    //Test if restLengthMinute or restLengthSeconds are null. If they are, then convert them to 0.

    if (restLengthMinute === null) {
        restLengthMinute = '0';
    }

    if (restLengthSecond === null) {
        restLengthSecond = '0';
    }

    existingUser.userPrograms[targetProgram].programExercises[
        targetProgramExercise
    ]['numRest'] = restNum;

    existingUser.userPrograms[targetProgram].programExercises[
        targetProgramExercise
    ]['restLengthMinutePerSet'] = restLengthMinute;

    existingUser.userPrograms[targetProgram].programExercises[
        targetProgramExercise
    ]['restLengthSecondPerSet'] = restLengthSecond;

    // console.log(existingUser.userPrograms);

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
        msg: 'Rest periods have been added between sets',
        userProgramExercises:
            updatedUser.userPrograms[targetProgram].programExercises,
    });
});
