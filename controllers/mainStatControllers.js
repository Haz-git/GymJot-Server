//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');
const _ = require('lodash.has');

//Returns all of a user's main powerlifting stats:
exports.getMainPLStats = handleAsync(async (req, res, next) => {
    const requestID = req.user._id;

    const existingUser = await User.findOne({ _id: requestID });
    const { userExistingPLStats } = existingUser;

    return res.status(200).json({
        status: 'Success',
        userExistingPLStats,
    });
});

//Adding new bench weight:
exports.addNewBench = handleAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'Success',
        message: 'Route initiated',
    });
});

//Adding new squat weight:
exports.addNewSquat = handleAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'Success',
        message: 'Route initiated',
    });
});

//Adding new deadlift weight:
exports.addNewDeadlift = handleAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'Success',
        message: 'Route initiated',
    });
});
