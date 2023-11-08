const express = require('express');
const { authController } = require('../controllers/authController');
var router = express.Router();


router.route('/signup')
    .get(authController.checkEmailDuplication)
    .post(authController.signUp)

router.get('/verifyEmail/:token', authController.verifyEmail)

module.exports = router;
