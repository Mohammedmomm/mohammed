const { config } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  if (config.NODE_ENV === 'development') {
    console.error(err.stack);
  } else {
    console.error(err.message);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
