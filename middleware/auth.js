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
