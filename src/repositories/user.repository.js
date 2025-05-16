const User = require('../models/user.model');

class UserRepository {
  async createUser(userData) {
    return User.create(userData);
  }

  async getUserById(id) {
    return User.findById(id);
  }

  async getUserByEmail(email) {
    return User.findOne({ email });
  }

  async updateUser(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
