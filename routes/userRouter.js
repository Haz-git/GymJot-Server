//Creating Express Router object:
const express = require('express');
const router = express.Router();

//Controllers:
const authController = require('../controllers/authControllers');

//Authentication Routes:
router.route('/signup').get(authController.testController);

module.exports = router;
