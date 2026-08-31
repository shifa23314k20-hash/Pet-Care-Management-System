const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;

  next(error);
};

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export {
  notFoundMiddleware,
  errorMiddleware,
};