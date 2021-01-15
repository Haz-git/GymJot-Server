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
    const {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    } = existingUser;

    const responseObject = {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    };

    return res.status(200).json({
        status: 'Success',
        responseObject,
    });
});

//Adding new bench weight:
exports.addNewBench = handleAsync(async (req, res, next) => {
    //Destructure information out of request.
    const { newBenchValue } = req.body;
    const { _id } = req.user;

    //Destructure weight and units out of request:
    let oldWeight;
    let { weight, unit } = newBenchValue;

    if (unit === 'Kgs') {
        weight = (weight * 2.20462).toFixed(2);
    }

    //Find user based on Id.
    const existingUser = await User.findOne({ _id: _id });

    //Storing the old weight as archived:
    oldWeight = existingUser.userExistingPLStats.bench;
    const currentTime = new Date();

    existingUser.userArchivedBenchStats.push({
        Date: currentTime,
        oldWeight: oldWeight,
    });

    //Converting the existing stat to new weight:
    existingUser.userExistingPLStats['bench'] = weight;

    //Calculating weight change:

    let weightChange;

    if (oldWeight !== 'NA') {
        weightChange = (weight - oldWeight).toFixed(2);
    } else {
        weightChange = weight;
    }

    //Archive the recent weight changes:
    existingUser.recentBenchWeightChange['updateTime'] = currentTime;
    existingUser.recentBenchWeightChange['weightChange'] = weightChange;

    //Update the current weight and archive the old weight:

    await User.updateOne(
        { _id },
        {
            $set: {
                userExistingPLStats: existingUser.userExistingPLStats,
                userArchivedBenchStats: existingUser.userArchivedBenchStats,
                recentBenchWeightChange: existingUser.recentBenchWeightChange,
            },
        },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    //Once updated, send response with updated user:

    const responseUser = await User.findOne({ _id });
    const {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    } = responseUser;

    const responseObject = {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    };

    res.status(200).json({
        status: 'Success',
        responseObject,
    });
});

//Adding new squat weight:
exports.addNewSquat = handleAsync(async (req, res, next) => {
    //Destructure information out of request.
    const { newSquatValue } = req.body;
    const { _id } = req.user;

    //Destructure weight and units out of request:
    let oldWeight;
    let { weight, unit } = newSquatValue;

    if (unit === 'Kgs') {
        weight = (weight * 2.20462).toFixed(2);
    }

    //Find user based on Id.
    const existingUser = await User.findOne({ _id: _id });

    //Storing the old weight as archived:
    oldWeight = existingUser.userExistingPLStats.squat;
    const currentTime = new Date();

    existingUser.userArchivedSquatStats.push({
        Date: currentTime,
        oldWeight: oldWeight,
    });

    //Converting the existing stat to new weight:
    existingUser.userExistingPLStats['squat'] = weight;

    //Calculating weight change:

    let weightChange;

    if (oldWeight !== 'NA') {
        weightChange = (weight - oldWeight).toFixed(2);
    } else {
        weightChange = weight;
    }

    //Archive the recent weight changes:
    existingUser.recentSquatWeightChange['updateTime'] = currentTime;
    existingUser.recentSquatWeightChange['weightChange'] = weightChange;

    //Update the current weight and archive the old weight:

    await User.updateOne(
        { _id },
        {
            $set: {
                userExistingPLStats: existingUser.userExistingPLStats,
                userArchivedSquatStats: existingUser.userArchivedSquatStats,
                recentSquatWeightChange: existingUser.recentSquatWeightChange,
            },
        },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    //Once updated, send response with updated user:

    const responseUser = await User.findOne({ _id });
    const {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    } = responseUser;

    const responseObject = {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    };

    res.status(200).json({
        status: 'Success',
        responseObject,
    });
});

//Adding new deadlift weight:
exports.addNewDeadlift = handleAsync(async (req, res, next) => {
    //Destructure information out of request.
    const { newDeadliftValue } = req.body;
    const { _id } = req.user;

    //Destructure weight and units out of request:
    let oldWeight;
    let { weight, unit } = newDeadliftValue;

    if (unit === 'Kgs') {
        weight = (weight * 2.20462).toFixed(2);
    }

    //Find user based on Id.
    const existingUser = await User.findOne({ _id: _id });

    //Storing the old weight as archived:
    oldWeight = existingUser.userExistingPLStats.deadlift;
    const currentTime = new Date();

    existingUser.userArchivedDeadliftStats.push({
        Date: currentTime,
        oldWeight: oldWeight,
    });

    //Converting the existing stat to new weight:
    existingUser.userExistingPLStats['deadlift'] = weight;

    //Calculating weight change:

    let weightChange;

    if (oldWeight !== 'NA') {
        weightChange = (weight - oldWeight).toFixed(2);
    } else {
        weightChange = weight;
    }

    //Archive the recent weight changes:
    existingUser.recentDeadliftWeightChange['updateTime'] = currentTime;
    existingUser.recentDeadliftWeightChange['weightChange'] = weightChange;

    //Update the current weight and archive the old weight:

    await User.updateOne(
        { _id },
        {
            $set: {
                userExistingPLStats: existingUser.userExistingPLStats,
                userArchivedDeadliftStats:
                    existingUser.userArchivedDeadliftStats,
                recentDeadliftWeightChange:
                    existingUser.recentDeadliftWeightChange,
            },
        },
        { bypassDocumentValidation: true },
        (err) => {
            if (err) console.log(err);
        }
    );

    //Once updated, send response with updated user:

    const responseUser = await User.findOne({ _id });
    const {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    } = responseUser;

    const responseObject = {
        userExistingPLStats,
        recentDeadliftWeightChange,
        recentBenchWeightChange,
        recentSquatWeightChange,
    };

    res.status(200).json({
        status: 'Success',
        responseObject,
    });
});
