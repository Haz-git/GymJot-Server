const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

//Initializing dotenv:
dotenv.config({
    path: `${__dirname}/../config.env`,
});

const JWTSECRET = process.env.JWT_SECRET;

//Schema:

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'A user requires a first name!'],
        },
        lastName: {
            type: String,
            required: [true, 'A user requires a last name!'],
        },
        userName: {
            type: String,
            required: [true, 'Please enter your desired username!'],
            minlength: [
                4,
                'Please create a username greater than 4 characters',
            ],
            maxlength: [
                15,
                'Please create a username less than 15 characters!',
            ],
            unique: [true, 'Sorry, this username has already been taken!'],
        },
        email: {
            type: String,
            required: [
                true,
                'Please enter an email address for your new account!',
            ],
            unique: [
                true,
                'Sorry! Someone else has already registered under this email address!',
            ],
            validate: {
                validator: validator.isEmail,
                message: 'Please input a valid email address',
            },
        },
        password: {
            type: String,
            required: [true, 'Please enter a password!'],
            minlength: [
                6,
                'Please enter a password greater than 6 characters!',
            ],
            maxlength: [20, 'Passwords cannot be over 20 characters'],
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password!'],
            validate: {
                validator: function (passwordConfirmValue) {
                    return passwordConfirmValue === this.password;
                },
                message: 'Your passwords do not match!',
            },
        },
    },
    { minimize: false }
);

//Create a pre-save Hook to hash password before save:
userSchema.pre('save', async function (next) {
    //hash the password on save:
    this.password = await bcrypt.hash(this.password, 12);
    //Set passwordConfirm to undefined:
    this.passwordConfirm = undefined;
    next();
});

//Creating instance method for comparing hashed password with hashed password stored in DB:
userSchema.methods.comparePasswords = async function (
    userSubmittedPassword,
    userPassword
) {
    return await bcrypt.compare(userSubmittedPassword, userPassword);
};

//Generates a JWT:
userSchema.methods.generateVerificationJWT = function () {
    const expiration = '1d';

    const signedToken = jwt.sign({ id: this._id }, JWTSECRET, {
        expiresIn: expiration, //1 Min expiration for testing purposes.
        //We will be using the default algorithm: HS256.
        algorithm: 'HS256',
    });

    return {
        token: 'Bearer ' + signedToken,
        expires: expiration,
    };
};

//Checks the designated field:
userSchema.statics.checkExistingField = async (field, value) => {
    const checkField = await User.findOne({ [`${field}`]: value });

    return checkField;
};

//Converts user to Json.
userSchema.methods.toJSON = function () {
    const user = this;

    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

//Creating Model:
const User = mongoose.model('User', userSchema);

module.exports = User;
