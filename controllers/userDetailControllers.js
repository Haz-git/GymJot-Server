//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');
const bcrypt = require('bcryptjs');

//Controller Functions:

exports.getExistingUserDetails = handleAsync(async (req, res, next) => {
    const { _id, email } = req.user;

    let existingUser = await User.findOne({
        _id: _id,
        email: email,
    });

    const { firstName, lastName, userName, isNewUser } = existingUser;

    res.status(200).json({
        msg: 'User information successfully retrieved',
        user: {
            firstName,
            lastName,
            userName,
            isNewUser,
            email: existingUser.email,
        },
    });
});

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
        case 'USER_INFO_CHANGE':
            //Do general user details change here,
            //Send request.
            const { newUserName, newFirstName, newLastName } = req.body;

            if (newUserName !== '' && newUserName !== undefined) {
                existingUser.userName = newUserName;
            }

            if (newFirstName !== '' && newFirstName !== undefined) {
                existingUser.firstName = newFirstName;
            }

            if (newLastName !== '' && newLastName !== undefined) {
                existingUser.lastName = newLastName;
            }

            await User.updateOne(
                { _id: _id, email: email },
                {
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    userName: existingUser.userName,
                },
                { bypassDocumentValidation: true },
                (err) => {
                    if (err) console.log(err);
                }
            );

            const updatedUser = await User.findOne({ _id: _id, email: email });

            res.status(200).json({
                msg: 'Your user information has been updated successfully.',
                user: {
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    userName: updatedUser.userName,
                    email: updatedUser.email,
                },
            });

            break;
        case 'EMAIL_CHANGE':
            const { newEmail } = req.body;

            if (newEmail !== '' && newEmail !== undefined) {
                existingUser.email = newEmail;
            }

            await User.updateOne(
                { _id: _id, email: email },
                {
                    email: existingUser.email,
                },
                { bypassDocumentValidation: true },
                (err) => {
                    if (err) console.log(err);
                }
            );

            //Removed email from being needed to retrieve updatedUser--existingUser.email is not finished being set before updatedEmailUser request is sent, leading to an error on first request, and then success on second request (two requests needed)

            const updatedEmailUser = await User.findOne({
                _id: _id,
                // email: email,
            });

            res.status(200).json({
                msg:
                    'Your user email has been updated. Your sign in credentials have been changed.',
                user: {
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    userName: existingUser.userName,
                    email: updatedEmailUser.email,
                },
            });

            break;
        case 'PASSWORD_CHANGE':
            const {
                newPassword,
                newPasswordConfirm,
                currentPassword,
            } = req.body;

            //There should be a front-end check to make sure newPassword and newPasswordConfirm is !== '' as well:

            if (newPassword !== '' && newPasswordConfirm !== '') {
                existingUser
                    .comparePasswords(currentPassword, existingUser.password)
                    .then(async (isValid) => {
                        if (isValid) {
                            //if isValid is true, then the currentPassword is the same as existing password, meaning we can proceed.

                            if (newPassword === newPasswordConfirm) {
                                //Second redundant matching check here, though there should be a match check in the frontend.

                                const newSavedPassword = await bcrypt.hash(
                                    newPassword,
                                    12
                                );

                                await User.updateOne(
                                    { _id: _id, email: email },
                                    {
                                        password: newSavedPassword,
                                    },
                                    { bypassDocumentValidation: true },
                                    (err) => {
                                        if (err) console.log(err);
                                    }
                                );

                                res.status(200).json({
                                    msg:
                                        'Your user password has been updated. Your sign in credentials have been changed.',
                                });
                            } else {
                                res.status(401).json({
                                    status: 'Failed',
                                    message:
                                        'Your password and password confirmation values do not match.',
                                });
                            }
                        } else {
                            res.status(401).json({
                                status: 'Failed',
                                message:
                                    'Your inputted password did not match the current password. Password change has been denied',
                            });
                        }
                    });
            }

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
