const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// add a header with:
// @description Register User
// @route GET /api/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
