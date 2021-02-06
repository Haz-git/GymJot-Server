//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

//Controller Functions:

//Grabs a user's program data:

exports.getAllPrograms = handleAsync(async (req, res, next) => {
    const { _id, email } = req.user;

    await User.findOne({
        _id: _id,
        email: email,
    }).then((user) => {
        res.status(200).json({
            message: 'User programs grabbed successfully.',
            userPrograms: user.userPrograms,
        });
    });
});

//Adds a new program to the user's program list.

exports.addNewProgram = handleAsync(async (req, res, next) => {
    const { programName, programDesc } = req.body;
    const { _id, email } = req.user;

    let userExistingPrograms = await User.findOne({
        _id: _id,
        email: email,
    }).select('userPrograms');

    userExistingPrograms.userPrograms.push({
        programName,
        programDesc,
        dateCreated: userExistingPrograms.generateDateNow(),
        programId: userExistingPrograms.generateUuid(),
        programExercises: [],
    });

    await User.updateOne(
        { _id: _id, email: email },
        { userPrograms: userExistingPrograms.userPrograms },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    const updatedUser = await User.findOne({ _id: _id, email: email }).select(
        'userPrograms'
    );

    res.status(200).json({
        msg: 'Program has been successfully added',
        userPrograms: updatedUser.userPrograms,
    });
});

exports.editExistingProgram = handleAsync(async (req, res, next) => {
    //Should serve to edit name and description of the program.

    const { programId, newProgramDesc, newProgramName } = req.body;
    const { _id, email } = req.user;

    console.log(newProgramName, newProgramDesc);

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const programEditIndex = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    console.log(programEditIndex);

    if (newProgramDesc !== undefined && newProgramDesc !== '') {
        existingUser.userPrograms[programEditIndex][
            'programDesc'
        ] = newProgramDesc;
    }

    if (newProgramName !== undefined && newProgramName !== '') {
        existingUser.userPrograms[programEditIndex][
            'programName'
        ] = newProgramName;
    }

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
        msg: 'Program name and description has successfully been edited.',
        userPrograms: updatedUser.userPrograms,
    });
});

exports.deleteExistingProgram = handleAsync(async (req, res, next) => {
    //Should serve to delete a program:

    const { programId } = req.body;
    const { _id, email } = req.user;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const deleteProgramIndex = existingUser.findProgramIndex(
        programId,
        existingUser.userPrograms
    );

    const deleteFormattedProgramIndex = existingUser.findProgramIndex(
        programId,
        existingUser.userFormattedPrograms
    );

    //Remove program from userPrograms as well as any formatted programs:

    existingUser.userPrograms.splice(deleteProgramIndex, 1);
    existingUser.userFormattedPrograms.splice(deleteFormattedProgramIndex, 1);

    await User.updateOne(
        { _id: _id, email: email },
        { userPrograms: existingUser.userPrograms },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    await User.updateOne(
        { _id: _id, email: email },
        { userFormattedPrograms: existingUser.userFormattedPrograms },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    const updatedUser = await User.findOne({ _id: _id, email: email }).select(
        'userPrograms'
    );

    res.status(200).json({
        msg: 'Program has been deleted successfully.',
        userPrograms: updatedUser.userPrograms,
    });
});
