//Creating Express Router object:
const express = require('express');
const router = express.Router();

//Passport:
const passport = require('passport');

//Controllers:
const authController = require('../controllers/authControllers');
const userDetailControllers = require('../controllers/userDetailControllers');

//Authentication Routes:
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

//Test protected route: -- We are testing JWT expiration and access.
router
    .route('/protected')
    .get(
        passport.authenticate('jwt', { session: false }),
        authController.testController
    );

//Initial Route to load user data:
router
    .route('/getUserData')
    .get(
        passport.authenticate('jwt', { session: false }),
        userDetailControllers.getUserData
    );

module.exports = router;
