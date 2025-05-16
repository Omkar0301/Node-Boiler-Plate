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
    return user;
  }

  async getUserByEmail(email) {
    const user = await userRepository.getUserByEmail(email);
    return user;
  }
}

module.exports = new UserService();
