const Joi = require('joi');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');

// Utility to extract only specified keys from an object
function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

// Safer way to update request properties without overwriting getters
function updateRequestProperties(target, source) {
  Object.keys(source).forEach((key) => {
    // Create new property if it doesn't exist or is writable
    if (
      !Object.prototype.hasOwnProperty.call(target, key) ||
      Object.getOwnPropertyDescriptor(target, key).writable
    ) {
      target[key] = source[key];
    }
  });
}

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(status.BAD_REQUEST, errorMessage));
  }

  // Update request properties safely
  Object.keys(value).forEach((key) => {
    if (value[key]) {
      updateRequestProperties(req[key], value[key]);
    }
  });

  return next();
};

module.exports = validate;
