//Creating Express Router object:
const express = require('express');
const router = express.Router();

//Passport:
const passport = require('passport');

//Controllers:
const authController = require('../controllers/authControllers');

//Authentication Routes:
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

//Test protected route:
router
    .route('/protected')
    .get(
        passport.authenticate('jwt', { session: false }),
        authController.testController
    );

module.exports = router;
