const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    //The client must send this Bearer Token in the Authorization header on every request it makes to obtain a protected resource.
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // else if(req.cookies.token) {
  //     token = req.cookies.token
  // }

  //Verify if the Token given matches
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    //Verify if the Token given matches
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    //Asign the user found with the token
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles so only those users with that specific role will be enabled/disabled to perform specific task
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};

// Review the   ownership of resource/ permistion to perform an action
exports.checkExistenceOwnership = (model) =>
  asyncHandler(async (req, res, next) => {
    let resource = await model.findById(req.params.id);
    // Check that resource exists
    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id:${req.params.id}`, 404),
      );
    }
    // If resource exists, make sure user owns the resource, unless they're admin
    if (req.user.role !== 'admin' && resource.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `You don't have permission to modify that resource`,
          401,
        ),
      );
    }
    next();
  });
