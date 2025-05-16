const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');

const auth = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, 'Authentication required');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new ApiError(status.FORBIDDEN, 'Insufficient permissions');
      }

      req.user = {
        id: decoded.sub,
        role: decoded.role,
        ...(decoded.sessionId && { sessionId: decoded.sessionId })
      };

      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.name === 'TokenExpiredError') {
          return next(new ApiError(status.UNAUTHORIZED, 'Token expired'));
        }
        return next(new ApiError(status.UNAUTHORIZED, 'Invalid token'));
      }
      next(err);
    }
  };
};

module.exports = auth;
