const errorHandler = (err, req, res, next) => {
  // Default to 500 Internal Server Error if statusCode is not provided
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

module.exports = errorHandler;
