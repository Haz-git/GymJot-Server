//Models:
const User = require('../models/userModel');

//Utilities:
const handleAsync = require('../util/handleAsync');
const throwAppError = require('../util/throwAppError');

exports.authCheck = (req, res, next) => {
    res.status(200).json({
        status: 'Success',
        message:
            'Your JWT is currently valid, you have access to protected routes.',
        valid: true,
    });
};

exports.signup = handleAsync(async (req, res, next) => {
    //Extracting user data from request object:
    console.log('Signup request');
    const {
        firstName,
        lastName,
        userName,
        email,
        password,
        passwordConfirm,
    } = req.body;

    //Creating new user using request object details:

    const newUser = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
        passwordConfirm,
    });

    //If all tests pass in the Schema, then the user will be created, and JSON response will be sent:

    res.status(200).json({
        status: 'Success',
        message: 'User has been added to the database.',
        user: newUser,
    });
});

exports.login = handleAsync(async (req, res, next) => {
    //Destructure credentials from request object:
    const { email, password } = req.body;

    //Finding user in database based on email:

    User.findOne({
        email: email,
    })
        .then((user) => {
            if (!user) {
                //If there is no found user:
                res.status(401).json({
                    status: 'Failed',
                    message: 'Could not find user',
                });
            }

            //If a valid user is found:

            user.comparePasswords(password, user.password)
                .then((isValid) => {
                    if (isValid) {
                        //If isValid is true, then the passwords are matching. Generate JWT for user.
                        const tokenObject = user.generateVerificationJWT();

                        res.status(200).json({
                            status: 'Success',
                            token: tokenObject.token,
                            expiresIn: tokenObject.expires,
                            user,
                        });
                    } else {
                        //isValid is false, send error:

                        res.status(401).json({
                            status: 'Failed',
                            message:
                                'Your verification details were incorrect.',
                        });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => {
            //If there are any errors, send to error handler.
            next(err);
        });
});
