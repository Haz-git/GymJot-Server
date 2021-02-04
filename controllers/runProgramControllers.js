/*
    This controller enables programs to be run with the user formatted blueprints.

*/

//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

exports.getFormattedProgram = handleAsync(async (req, res, next) => {
    //This controller function should be useful when user is running program...
    res.status(200).json({
        msg: 'This route has been established',
    });
});

exports.editFormattedProgram = handleAsync(async (req, res, next) => {
    //This controller function will serve as an add/edit. Basically, since each program can have only one active blueprint, any subsequence 'saves' will override the existing one.

    const { _id, email } = req.user;
    const { formattedProgramObject, programId } = req.body;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const programTargetIndex = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    console.log(programTargetIndex);

    //Check if the submitted formatted program is already within the userFormattedPrograms array:

    if (existingUser.findExistingFormattedProgram(programId) === false) {
        //If the program does not already exist, push it in.
        //find target program, and push program with formattedProgramObject into userFormattedPrograms array:

        const tempProgram = existingUser.userPrograms[programTargetIndex];

        tempProgram['formattedExercises'] = formattedProgramObject;
        tempProgram['dateLastFormatted'] = existingUser.generateDateNow();

        delete tempProgram['programExercises'];

        existingUser.userFormattedPrograms.push(tempProgram);

        console.log(existingUser.userFormattedPrograms);
    } else if (existingUser.findExistingFormattedProgram(programId) === true) {
        //If the program already exists within userFormattedPrograms, then find the correct program and replace the 'formattedExercises' information:

        const replaceIndex = existingUser.findProgramIndex(
            programId,
            existingUser.userFormattedPrograms
        );

        existingUser.userFormattedPrograms[replaceIndex][
            'formattedExercises'
        ] = formattedProgramObject;

        //Update recently formatted:

        existingUser.userFormattedPrograms[replaceIndex][
            'dateLastFormatted'
        ] = existingUser.generateDateNow();
    }

    await User.updateOne(
        { _id: _id, email: email },
        { userFormattedPrograms: existingUser.userFormattedPrograms },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    const updatedUser = await User.findOne({ _id: _id, email: email }).select(
        'userFormattedPrograms'
    );

    res.status(200).json({
        msg: 'This route has been established (edit)',
        userFormattedProgram: updatedUser,
    });
});
