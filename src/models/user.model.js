const mongoose = require('mongoose');
const constants = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(constants.ROLES),
      default: constants.ROLES.USER
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1, role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
