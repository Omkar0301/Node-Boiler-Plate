const Joi = require('joi');

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email()
  })
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
};

module.exports = {
  getUser,
  updateUser,
  deleteUser
};
