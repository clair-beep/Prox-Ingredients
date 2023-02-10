const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');

// add a header with:
// @description Get all categories
// @route GET /api/v1/products/:productId/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.productId) {
    query = Category.find({ product: req.params.productId });
  } else {
    query = Category.find().populate({
      path: 'product',
      select: 'name description'
    });
  }

  const products = await query;

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});
