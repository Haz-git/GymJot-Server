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
