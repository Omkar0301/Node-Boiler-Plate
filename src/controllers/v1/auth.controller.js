const { status } = require('http-status');
const authService = require('../../services/auth.service');
const tokenService = require('../../services/token.service');
const ApiError = require('../../utils/ApiError');
const userService = require('../../services/user.service');
const { sendSuccess } = require('../../utils/response');

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

      return sendSuccess(
        res,
        'User created successfully',
        { user: userResponse },
        {},
        status.CREATED
      );
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

      tokenService.setTokenCookies(res, tokens);
      return sendSuccess(res, '', {}, {}, status.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh auth tokens
   */
  refreshTokens: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new ApiError(status.BAD_REQUEST, 'Refresh token is missing. Please login again.');
      }

      const tokens = await authService.refreshAuthTokens(refreshToken);

      tokenService.setTokenCookies(res, tokens);

      return sendSuccess(res, 'Tokens refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      tokenService.clearTokenCookies(res);

      return sendSuccess(res, '', {}, {}, status.NO_CONTENT);
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

      return sendSuccess(res, 'User profile fetched successfully', { user: userResponse });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
