const { status } = require('http-status');
const userService = require('../../services/user.service');
const { sendSuccess } = require('../../utils/response');
const parseQuery = require('../../utils/parseQuery');

const userController = {
  /**
   * Get user by ID
   */
  getUser: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.userId);
      return sendSuccess(res, 'User fetched successfully', user, {}, status.OK);
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
      return sendSuccess(res, 'User updated successfully', user, {}, status.OK);
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
      return sendSuccess(res, 'User deleted successfully', null, {}, status.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (req, res, next) => {
    try {
      const { filters, sort: sortFields, pageNo = 1, pageSize = 10 } = req.body;
      const { query, sortBy, skip, limit } = parseQuery({
        filters,
        sort: sortFields,
        pageNo,
        pageSize
      });

      const { users, total } = await userService.queryUsers({ query, sortBy, skip, limit });

      return sendSuccess(
        res,
        'Users fetched successfully',
        users,
        { total, pageNo, pageSize },
        status.OK
      );
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
