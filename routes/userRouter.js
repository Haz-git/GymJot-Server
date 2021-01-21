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

//Authentication Routes:
router.route('/signup').post(authControllers.signup);
router.route('/login').post(authControllers.login);

//Test protected route: -- We are testing JWT expiration and access.
router
    .route('/protected')
    .get(
        passport.authenticate('jwt', { session: false }),
        authControllers.testController
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
    .get(
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

module.exports = router;
