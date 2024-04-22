const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
  
    if (process.env.NODE_ENV === 'development') {
      res.status(statusCode).json({
        message: err.message,
        stack: err.stack,
      });
    } else {
      res.status(statusCode).json({
        message: err.message,
      });
    }
  };
  
  module.exports = errorHandler;
  