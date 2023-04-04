const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // log to console for dev
  //console.log(err);

  //Moongose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
    error.errorType = 'notFound';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
    error.errorType = 'duplicate';
  }

  //Mongoose validatio error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val, index) => `${index + 1}. ${val.path}: ${val.message}`)
      .join(';');
    error = new ErrorResponse(message, 400);
    error.errorType = 'validation';
    console.log(error.errorType);
  }

  // Render an error page
  res.status(error.statusCode || 500).render('error/error', { error });
  console.log(error);
};

module.exports = errorHandler;
