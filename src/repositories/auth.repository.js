const Token = require('../models/token.model');

class AuthRepository {
  /**
   * Save token
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
   * Find token
   */
  async findToken(token, type) {
    const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
    return tokenDoc;
  }

  /**
   * Remove token
   */
  async removeToken(token, type) {
    const tokenDoc = await Token.findOneAndDelete({ token, type });
    return tokenDoc;
  }
}

module.exports = new AuthRepository();
