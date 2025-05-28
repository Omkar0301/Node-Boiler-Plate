const bcrypt = require('bcryptjs');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const tokenService = require('./token.service');
const authRepository = require('../repositories/auth.repository');
const cacheService = require('./cache.service');
const config = require('../config');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    if (await userService.findUserByEmail(userData.email)) {
      throw new ApiError(status.BAD_REQUEST, 'Email already taken');
    }
    return userService.createUser(userData);
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(status.UNAUTHORIZED, 'Incorrect email or password');
    }
    await cacheService.set(`user:${user._id}`, user);
    await cacheService.set(`user:email:${email}`, user);

    return user;
  }

  /**
   * Logout user
   */
  async logout(refreshToken) {
    const tokenDoc = await authRepository.removeToken(refreshToken, 'refresh');
    if (!tokenDoc) {
      throw new ApiError(status.NOT_FOUND, 'Token not found');
    }
    await cacheService.flushAll();

    return tokenDoc;
  }

  /**
   * Refresh auth tokens
   */
  async refreshAuthTokens(refreshToken) {
    try {
      const tokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');

      if (!tokenDoc || !tokenDoc.user) {
        throw new ApiError(status.UNAUTHORIZED, 'Invalid refresh token');
      }

      const user = await userService.getUserById(tokenDoc.user);
      if (!user) {
        throw new ApiError(status.UNAUTHORIZED, 'User not found');
      }

      await authRepository.removeToken(refreshToken, 'refresh');
      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(status.UNAUTHORIZED, 'Invalid refresh token');
    }
  }
}

module.exports = new AuthService();
