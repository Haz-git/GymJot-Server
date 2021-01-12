//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

//Controller Functions:

exports.getUserData = (req, res, next) => {
    console.log('.');
    console.log(req.body);

    res.status(200).json({
        status: 'Success',
        message: 'Test route',
    });
};
