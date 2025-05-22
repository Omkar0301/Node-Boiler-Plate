const User = require('../models/user.model');

class UserRepository {
  async createUser(userData) {
    return User.create(userData);
  }

  async getUserById(id) {
    return User.findById(id);
  }

  async getUserByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  async updateUser(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async queryUsers({ query = {}, sortBy = {}, skip = 0, limit = 10, populatePaths = [] }) {
    let queryBuilder = User.find(query);
    populatePaths.forEach((path) => {
      queryBuilder = queryBuilder.populate(path);
    });
    const data = await queryBuilder.sort(sortBy).skip(skip).limit(limit).exec();
    const total = await User.countDocuments(query);

    return { total, users: data };
  }
}

module.exports = new UserRepository();
