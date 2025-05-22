const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validation');
const userValidation = require('../../validations/user.validation');

router.use(auth('admin'));

router.route('/').post(validate(userValidation.listUsers), userController.getAllUsers);

router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
