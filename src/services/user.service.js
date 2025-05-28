const ApiError = require('../utils/ApiError');
const { status } = require('http-status');
const userRepository = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password');
const cacheService = require('./cache.service');

class UserService {
  async createUser(userData) {
    if (await userRepository.getUserByEmail(userData.email)) {
      throw new ApiError(status.BAD_REQUEST, 'Email already taken');
    }
    userData.password = await hashPassword(userData.password);
    return userRepository.createUser(userData);
  }

  async getUserById(id) {
    const cacheKey = `user:${id}`;

    const cachedUser = await cacheService.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const cacheKey = `user:email:${email}`;

    const cachedUser = await cacheService.get(cacheKey);
    if (cachedUser) {
      cachedUser.id = cachedUser._id;
      return cachedUser;
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async findUserByEmail(email) {
    return userRepository.getUserByEmail(email);
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    const updatedUser = await userRepository.updateUser(id, updateData);
    if (!updatedUser) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    await cacheService.set(`user:${id}`, updatedUser);
    if (updatedUser.email) {
      await cacheService.set(`user:email:${updatedUser.email}`, updatedUser);
    }
    await cacheService.deleteByPattern('users:*');

    return updatedUser;
  }

  async deleteUser(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new ApiError(status.NOT_FOUND, 'User not found');
    }
    const deletedUser = await userRepository.deleteUser(id);

    await cacheService.delete(`user:${id}`);
    if (user.email) {
      await cacheService.delete(`user:email:${user.email}`);
    }
    await cacheService.deleteByPattern('users:*');

    return deletedUser;
  }

  async queryUsers({ query = {}, sortBy = {}, skip = 0, limit = 10 }) {
    const cacheKey = `users:${JSON.stringify({ query, sortBy, skip, limit })}`;

    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const result = await userRepository.queryUsers({ query, sortBy, skip, limit });

    await cacheService.set(cacheKey, result);

    return result;
  }
}

module.exports = new UserService();
