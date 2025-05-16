const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validation');
const userValidation = require('../../validations/user.validation');

router.get('/', auth('admin'), userController.getAllUsers);
router.get('/:userId', auth(), validate(userValidation.getUser), userController.getUser);
router.patch('/:userId', auth(), validate(userValidation.updateUser), userController.updateUser);
router.delete('/:userId', auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
