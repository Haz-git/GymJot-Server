//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

//Controller Functions:

exports.editExistingUserDetails = handleAsync(async (req, res, next) => {
    /*I think in this function we can create a switch/case and check for what is needed, I.E:
        A. General User Details = firstName, lastName, userName,
        B. Email Change = email,
        C. Password Change = password,

    This way, we minimize the need for multiple routes.
    */

    const { _id, email } = req.user;
    const { requestType } = req.body;

    //Find User

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    switch (requestType) {
        case 'GENERAL_USER_DETAILS_CHANGE':
            //Do general user details change here,
            //Send request.
            break;
        case 'EMAIL_CHANGE':
            break;
        case 'PASSWORD_CHANGE':
            break;
        default:
            return res.status(500).json({
                msg: 'Error. The server was unable to handle your request',
            });
    }

    // res.status(200).json({
    //     msg: 'This route handles existing user details edits',
    // });
});
