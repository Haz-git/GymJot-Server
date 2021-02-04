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
    res.status(200).json({
        msg: 'This route has been established (edit)',
    });
});
