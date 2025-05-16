const { status } = require('http-status');
const authService = require('../../services/auth.service');
const tokenService = require('../../services/token.service');
const ApiError = require('../../utils/ApiError');
const userService = require('../../services/user.service');

const authController = {
  /**
   * Register new user
   */
  register: async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      const tokens = await tokenService.generateAuthTokens(user);

      tokenService.setTokenCookies(res, tokens);

      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.status(status.CREATED).json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login user
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      const tokens = await tokenService.generateAuthTokens(user);

      // Set tokens in HTTP-only cookies
      tokenService.setTokenCookies(res, tokens);

      // Optionally, omit sensitive data
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.status(status.OK).json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh auth tokens
   */
  refreshTokens: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new ApiError(status.BAD_REQUEST, 'Refresh token is missing');
      }

      const tokens = await authService.refreshAuthTokens(refreshToken);

      // Set the new tokens in cookies
      tokenService.setTokenCookies(res, tokens);

      res.status(status.OK).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (req, res, next) => {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear the cookies
      tokenService.clearTokenCookies(res);

      res.status(status.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current authenticated user
   */
  getMe: async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(status.UNAUTHORIZED, 'Not authenticated');
      }
      const user = await userService.getUserById(req.user.id);

      if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
      }
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.status(status.OK).json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
