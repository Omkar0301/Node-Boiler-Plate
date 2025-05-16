const { status } = require('http-status');
const userService = require('../../services/user.service');
const ApiError = require('../../utils/ApiError');

const userController = {
  /**
   * Get user by ID
   */
  getUser: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.userId);
      if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
      }
      res.status(status.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user
   */
  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.userId, req.body);
      res.status(status.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (req, res, next) => {
    try {
      await userService.deleteUser(req.params.userId);
      res.status(status.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      res.status(status.OK).json(users);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
