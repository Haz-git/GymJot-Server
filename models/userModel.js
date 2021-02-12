const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const dotenv = require('dotenv');
const { v4: uuid } = require('uuid');

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
        userExistingPLStats: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                bench: 'NA',
                squat: 'NA',
                deadlift: 'NA',
            },
        },
        recentBenchWeightChange: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                updateTime: 'NA',
                weightChange: 'NA',
            },
        },
        recentSquatWeightChange: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                updateTime: 'NA',
                weightChange: 'NA',
            },
        },
        recentDeadliftWeightChange: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                updateTime: 'NA',
                weightChange: 'NA',
            },
        },
        userArchivedBenchStats: [],
        userArchivedSquatStats: [],
        userArchivedDeadliftStats: [],
        userSavedStats: [],
        userPrograms: [],
        userFormattedPrograms: [],
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

//Generates a current date object:

userSchema.methods.generateDateNow = function () {
    return dayjs().format();
};

//Finds an object's index number in an array (This will be for accessing exerciseName + exerciseID):

userSchema.methods.findExerciseIndex = function (exerciseId, array) {
    let index = array.findIndex((object) => object.exerciseId === exerciseId);

    return index;
};

//Finds the user's program index number in the program array:

userSchema.methods.findProgramIndex = function (programId, array) {
    const index = array.findIndex((object) => object.programId === programId);

    return index;
};

//Find user's program exercise's index number:
userSchema.methods.findProgramExerciseIndex = function (
    type,
    programExerciseId,
    array
) {
    const index = array.findIndex(
        (object) => object[`${type}`] === programExerciseId
    );

    return index;
};

//Generates a random UUIDv4:

userSchema.methods.generateUuid = function () {
    return uuid();
};

//Loops through arguments, adding them to the desired user's record:

userSchema.methods.findAndEditRecord = function (
    exerciseId,
    recordId,
    editValues
) {
    const user = this;

    const exerciseIndex = user.userSavedStats.findIndex(
        (object) => object.exerciseId === exerciseId
    );

    const recordIndex = user.userSavedStats[exerciseIndex].records.findIndex(
        (record) => record.recordId === recordId
    );

    for (const property in editValues) {
        user.userSavedStats[exerciseIndex].records[recordIndex][`${property}`] =
            editValues[property];
    }

    console.log(user.userSavedStats[exerciseIndex].records[recordIndex]);

    return user.userSavedStats;
};

userSchema.methods.findNumRestBetweenSets = function (
    targetProgramId,
    targetProgramExerciseId
) {
    const user = this;

    if (
        user.userPrograms[targetProgramId].programExercises[
            targetProgramExerciseId
        ]['sets'] !== undefined &&
        user.userPrograms[targetProgramId].programExercises[
            targetProgramExerciseId
        ]['setObjectsArray'] === undefined
    ) {
        //If all the conditions are satisfied, then the numRest will be calculated for non-pyramid sets.
        const numSets =
            user.userPrograms[targetProgramId].programExercises[
                targetProgramExerciseId
            ]['sets'];

        return parseInt(numSets) - 1;
    } else if (
        user.userPrograms[targetProgramId].programExercises[
            targetProgramExerciseId
        ]['sets'] === undefined &&
        user.userPrograms[targetProgramId].programExercises[
            targetProgramExerciseId
        ]['setObjectsArray'] !== undefined
    ) {
        //If all of the conditions are met above, then the numRest will be calculated for pyramid sets.
        const numSets =
            user.userPrograms[targetProgramId].programExercises[
                targetProgramExerciseId
            ]['setObjectsArray'].length;

        return parseInt(numSets) - 1;
    }
};

userSchema.methods.findExistingFormattedProgram = function (targetProgramId) {
    //This should return true if an existing program is found.
    const user = this;

    const formattedProgramIndex = user.userFormattedPrograms.findIndex(
        (program) => program.programId === targetProgramId
    );

    if (formattedProgramIndex === -1) {
        return false;
    } else {
        return true;
    }
};

userSchema.methods.generateProgramSequence = function (formattedProgramArray) {
    //The purpose of this function is to generate an exercise sequence of with runProgram in the front-end will follow:

    /*
        1. Iterate through array
        2. For each item in array, check for numRest, and make note of that number.
        3. Recognize the number of sets: create an iterator for numSets and numRest
        4. Create a for loop to push in an exercise (with the correct details and Id, just in case), and then a rest until iterator is 0.
    */

    let resultSequence = [];
    formattedProgramArray.forEach((item) => {
        if (
            item.exerciseDetails !== undefined &&
            item.exerciseDetails !== null &&
            item.exerciseDetails.setObjectsArray === undefined &&
            item.exerciseDetails.numRest !== undefined &&
            item.exerciseDetails.numRest !== null
        ) {
            //Support for exercises with rest between sets:
            const {
                numRest,
                sets,
                restLengthMinutePerSet,
                restLengthSecondPerSet,
                programExerciseId,
                programExerciseName,
                reps,
                weight,
            } = item.exerciseDetails;

            let restLimit = parseInt(numRest);
            let setLimit = parseInt(sets);

            //Generate two arrays:
            let restArray = [];
            let setArray = [];

            for (let i = 0; i < restLimit; i++) {
                restArray.push({
                    restNum: i + 1,
                    restLengthMinutePerSet: restLengthMinutePerSet,
                    restLengthSecondPerSet: restLengthSecondPerSet,
                });
            }

            for (let j = 0; j < setLimit; j++) {
                setArray.push({
                    programExerciseName: programExerciseName,
                    programExerciseId: programExerciseId,
                    currentSet: j + 1,
                    totalSets: sets,
                    reps: reps,
                    weight: weight,
                });
            }

            //Combine the arrays with alternating info:

            let arrayCombined = setArray
                .map(function (v, i) {
                    return [v, restArray[i]];
                })
                .reduce(function (a, b) {
                    return a.concat(b);
                });

            //Removes undefined final value:
            arrayCombined.pop();

            //Push combined sequence into results array:

            resultSequence.push(arrayCombined);
        } else if (item.exerciseDetails.setObjectsArray !== undefined) {
            //Support for pyramid sets:
            const {
                numRest,
                restLengthMinutePerSet,
                restLengthSecondPerSet,
                programExerciseId,
                programExerciseName,
            } = item.exerciseDetails;

            let restLimit = parseInt(numRest);

            let restArray = [];
            let setArray = [];

            //Items in array:

            // setId,
            // weight,
            // reps,
            // unit,

            for (
                let i = 0;
                i < item.exerciseDetails.setObjectsArray.length;
                i++
            ) {
                const {
                    setId,
                    weight,
                    reps,
                    unit,
                } = item.exerciseDetails.setObjectsArray[i];

                //push the exercise sets into the setArray;
                setArray.push({
                    programExerciseName: programExerciseName,
                    programExerciseId: programExerciseId,
                    currentSet: setId,
                    totalSets: item.exerciseDetails.setObjectsArray.length,
                    reps: reps,
                    weight: weight,
                    unit: unit,
                });
            }

            for (let j = 0; j < restLimit; j++) {
                restArray.push({
                    restNum: j + 1,
                    restLengthMinutePerSet: restLengthMinutePerSet,
                    restLengthSecondPerSet: restLengthSecondPerSet,
                });
            }

            let arrayCombined = setArray
                .map(function (v, i) {
                    return [v, restArray[i]];
                })
                .reduce(function (a, b) {
                    return a.concat(b);
                });

            //Removes undefined final value:
            arrayCombined.pop();

            //Push combined sequence into results array:

            resultSequence.push(arrayCombined);
        } else if (
            item.restDetails !== undefined &&
            item.restDetails !== null
        ) {
            //Support for rest periods:

            const {
                programExerciseName,
                restLengthMinute,
                restLengthSecond,
                restId,
            } = item.restDetails;

            resultSequence.push({
                programExerciseName: programExerciseName,
                restLengthMinute: restLengthMinute,
                restLengthSecond: restLengthSecond,
                restId: restId,
            });
        } else if (
            item.exerciseDetails !== undefined &&
            item.exerciseDetails.restNum === undefined
        ) {
            //Support for single set exercises or exercises without rest between sets

            const {
                sets,
                programExerciseId,
                programExerciseName,
                reps,
                weight,
            } = item.exerciseDetails;

            let setLimit = parseInt(sets);
            let setArray = [];

            for (let j = 0; j < setLimit; j++) {
                setArray.push({
                    programExerciseName: programExerciseName,
                    programExerciseId: programExerciseId,
                    currentSet: j + 1,
                    totalSets: sets,
                    reps: reps,
                    weight: weight,
                });
            }

            resultSequence.push(setArray);
        }
    });

    return resultSequence.flat();
};

//Creating Model:
const User = mongoose.model('User', userSchema);

module.exports = User;
