const ApiError = require('../utils/ApiError');
const { status } = require('http-status');
const userRepository = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password');

class UserService {
  async createUser(userData) {
    if (await userRepository.getUserByEmail(userData.email)) {
      throw new ApiError(status.BAD_REQUEST, 'Email already taken');
    }
    userData.password = await hashPassword(userData.password);
    return userRepository.createUser(userData);
  }

  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    return user;
  }
  async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    const updatedUser = await userRepository.updateUser(id, updateData);
    if (!updatedUser) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    return updatedUser;
  }

  async deleteUser(id) {
    const deletedUser = await userRepository.deleteUser(id);
    if (!deletedUser) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    return deletedUser;
  }

  async queryUsers(queryParams) {
    return userRepository.queryUsers(queryParams);
  }
}

module.exports = new UserService();
