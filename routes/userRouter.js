//Creating Express Router object:
const express = require('express');
const router = express.Router();

//Passport:
const passport = require('passport');

//Controllers:
const authControllers = require('../controllers/authControllers');
const mainStatControllers = require('../controllers/mainStatControllers');

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

//Main Powerlifting Stats Routes:

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

module.exports = router;
