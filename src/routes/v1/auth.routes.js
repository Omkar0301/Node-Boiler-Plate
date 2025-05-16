const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v1/auth.controller');
const validate = require('../../middlewares/validation');
const authValidation = require('../../validations/auth.validation');
const auth = require('../../middlewares/auth');

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-tokens', authController.refreshTokens);
router.get('/me', auth(), authController.getMe);
router.post('/logout', auth(), authController.logout);

module.exports = router;
