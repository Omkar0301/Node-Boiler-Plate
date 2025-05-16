const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');
const tokenRepository = require('../repositories/token.repository');
const constants = require('../utils/constants');

class TokenService {
  /**
   * Generate token
   */
  async generateToken(userId, role, expires, type, secret = config.jwt.secret) {
    const payload = {
      sub: userId,
      role: role,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    };
    return jwt.sign(payload, secret);
  }

  /**
   * Generate auth tokens
   */
  async generateAuthTokens(user) {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = await this.generateToken(
      user.id,
      user.role,
      accessTokenExpires,
      constants.TOKEN_TYPES.ACCESS
    );

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = await this.generateToken(
      user.id,
      user.role,
      refreshTokenExpires,
      constants.TOKEN_TYPES.REFRESH
    );

    await tokenRepository.saveToken(
      user.id,
      refreshToken,
      refreshTokenExpires,
      constants.TOKEN_TYPES.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    };
  }

  /**
   * Verify token
   */
  async verifyToken(token, type) {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await tokenRepository.findToken(token, type);
    if (!tokenDoc || payload.type !== type) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }

  /**
   * Set token cookies in response
   */
  async setTokenCookies(res, tokens) {
    const cookieOptions = {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict'
    };

    // Access token cookie
    res.cookie('accessToken', tokens.access.token, {
      ...cookieOptions,
      maxAge: config.jwt.accessExpirationMinutes * 60 * 1000 // Convert minutes to ms
    });

    // Refresh token cookie
    res.cookie('refreshToken', tokens.refresh.token, {
      ...cookieOptions,
      maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000 // Convert days to ms
    });
  }

  /**
   * Clear token cookies from response
   */
  async clearTokenCookies(res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  /**
   * Get token from cookies
   */
  async getTokenFromCookies(req, type) {
    return req.cookies[`${type}Token`];
  }

  /**
   * Cleanup old tokens
   */
  async cleanupOldTokens(daysToKeep = config.tokenCleanup.daysToKeep || 2) {
    const cutoffDate = moment().subtract(daysToKeep, 'days').toDate();
    return tokenRepository.removeTokensOlderThan(cutoffDate);
  }
}

module.exports = new TokenService();
