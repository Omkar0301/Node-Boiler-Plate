const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.db.url;

// Import models
db.User = require('./user.model');
db.Token = require('./token.model');

module.exports = db;
