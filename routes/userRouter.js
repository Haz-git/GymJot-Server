//Creating Express Router object:
const express = require('express');
const router = express.Router();

//Passport:
const passport = require('passport');

//Controllers:
const authControllers = require('../controllers/authControllers');
const mainStatControllers = require('../controllers/mainStatControllers');
const statControllers = require('../controllers/statControllers');
const recordControllers = require('../controllers/recordControllers');
const programControllers = require('../controllers/programControllers');
const programExerciseControllers = require('../controllers/programExerciseControllers');
const runProgramControllers = require('../controllers/runProgramControllers');
const userDetailControllers = require('../controllers/userDetailControllers');
const tutorialModalControllers = require('../controllers/tutorialModalControllers');

//Authentication Routes:
router.route('/signup').post(authControllers.signup);
router.route('/login').post(authControllers.login);

//Test protected route: -- We are testing JWT expiration and access.
router
    .route('/protected')
    .get(
        passport.authenticate('jwt', { session: false }),
        authControllers.authCheck
    );

//Route for 'isNewUser' tutorial modal ///////////////////:
router
    .route('/setisnewuser')
    .post(
        passport.authenticate('jwt', { session: false }),
        tutorialModalControllers.setIsNewUserValue
    );

router
    .route('/getisnewuservalue')
    .get(
        passport.authenticate('jwt', { session: false }),
        tutorialModalControllers.getIsNewUserValue
    );

//Main Powerlifting Stats Routes \\\\\\\\\\\\\\\\:

router
    .route('/getMainPLStats')
    .get(
        passport.authenticate('jwt', { session: false }),
        mainStatControllers.getMainPLStats
    );

//Add new bench:

router
    .route('/addnewbench')
    .post(
        passport.authenticate('jwt', { session: false }),
        mainStatControllers.addNewBench
    );

//Add new squat:

router
    .route('/addnewsquat')
    .post(
        passport.authenticate('jwt', { session: false }),
        mainStatControllers.addNewSquat
    );

//Add new deadlift:

router
    .route('/addnewdeadlift')
    .post(
        passport.authenticate('jwt', { session: false }),
        mainStatControllers.addNewDeadlift
    );

//Stat Input Routes \\\\\\\\\\\\\\\\:

router
    .route('/getallstats')
    .get(
        passport.authenticate('jwt', { session: false }),
        statControllers.getAllStoredStats
    );

router
    .route('/addnewstat')
    .post(
        passport.authenticate('jwt', { session: false }),
        statControllers.addNewStat
    );

router
    .route('/deletestat')
    .delete(
        passport.authenticate('jwt', { session: false }),
        statControllers.deleteExistingStat
    );

router
    .route('/editstat')
    .patch(
        passport.authenticate('jwt', { session: false }),
        statControllers.editExistingStat
    );

//Stat Record Routes \\\\\\\\\\\\\\\\:

router
    .route('/stat/getallrecords')
    .post(
        passport.authenticate('jwt', { session: false }),
        recordControllers.getUserRecordData
    );

router
    .route('/stat/addnewrecord')
    .post(
        passport.authenticate('jwt', { session: false }),
        recordControllers.addNewRecord
    );

router
    .route('/stat/editrecord')
    .patch(
        passport.authenticate('jwt', { session: false }),
        recordControllers.editRecord
    );

router
    .route('/stat/deleterecord')
    .delete(
        passport.authenticate('jwt', { session: false }),
        recordControllers.deleteRecord
    );

//Main Programs Routes \\\\\\\\\\\\\\\\:

router
    .route('/programs')
    .get(
        passport.authenticate('jwt', { session: false }),
        programControllers.getAllPrograms
    );

router
    .route('/addnewprogram')
    .post(
        passport.authenticate('jwt', { session: false }),
        programControllers.addNewProgram
    );

router
    .route('/editprogram')
    .patch(
        passport.authenticate('jwt', { session: false }),
        programControllers.editExistingProgram
    );

router
    .route('/deleteprogram')
    .delete(
        passport.authenticate('jwt', { session: false }),
        programControllers.deleteExistingProgram
    );

router
    .route('/increaseprogramruncount')
    .post(
        passport.authenticate('jwt', { session: false }),
        programControllers.increaseProgramRunCount
    );

router
    .route('/addnewprogramtimelength')
    .post(
        passport.authenticate('jwt', { session: false }),
        programControllers.editProgramTimeLength
    );

//Program Exercise Routes (under programs) \\\\\\\\\\\\\\\\:

router
    .route('/programs/getprogramexercises')
    .post(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.getAllProgramExercises
    );

router
    .route('/programs/addnewprogramexercise')
    .post(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.addNewProgramExercise
    );

router
    .route('/programs/addnewprogramcardio')
    .post(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.addNewProgramCardio
    );

router
    .route('/programs/addnewprogrampyramidset')
    .post(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.addNewProgramPyramidSet
    );

router
    .route('/programs/addnewrestperiod')
    .post(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.addNewRestPeriod
    );

router
    .route('/programs/addrestperiodbetweensets')
    .post(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.addRestPeriodsBetweenSets
    );

router
    .route('/programs/deleteprogramexercise')
    .delete(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.deleteProgramExercise
    );

router
    .route('/programs/deleteprogramrestperiod')
    .delete(
        passport.authenticate('jwt', { session: false }),
        programExerciseControllers.deleteRestPeriod
    );

//Formatted Program Routes (used when user runs a program) \\\\\\\\\\\\\\\\:

router
    .route('/programs/getformattedprogram')
    .post(
        passport.authenticate('jwt', { session: false }),
        runProgramControllers.getFormattedProgram
    );

router
    .route('/programs/editformattedprogram')
    .post(
        passport.authenticate('jwt', { session: false }),
        runProgramControllers.editFormattedProgram
    );

// Routes for user detail changes \\\\\\\\\\\\\\\\\\\\\\\\:

router
    .route('/settings/getuserdetails')
    .get(
        passport.authenticate('jwt', { session: false }),
        userDetailControllers.getExistingUserDetails
    );

router
    .route('/settings/edituserdetails')
    .post(
        passport.authenticate('jwt', { session: false }),
        userDetailControllers.editExistingUserDetails
    );

module.exports = router;
