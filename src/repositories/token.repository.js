const Token = require('../models/token.model');

class TokenRepository {
  /**
   * Save token to database
   */
  async saveToken(userId, token, expires, type, blacklisted = false) {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires,
      type,
      blacklisted
    });
    return tokenDoc;
  }

  /**
   * Find token in database
   */
  async findToken(token, type) {
    const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
    return tokenDoc;
  }

  /**
   * Remove token from database
   */
  async removeToken(token, type) {
    const tokenDoc = await Token.findOneAndDelete({ token, type });
    return tokenDoc;
  }

  async removeTokensOlderThan(cutoffDate) {
    return Token.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
  }
}

module.exports = new TokenRepository();
