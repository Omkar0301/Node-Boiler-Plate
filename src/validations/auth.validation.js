const Joi = require('joi');
const constants = require('../utils/constants');

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid(...Object.values(constants.ROLES))
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
};

module.exports = {
  register,
  login
};
