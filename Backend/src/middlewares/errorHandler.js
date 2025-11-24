const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
      detail: err.detail
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Foreign key constraint violation',
      detail: err.detail
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
