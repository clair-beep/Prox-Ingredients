const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');

// add a header with:
// @description Get all products
// @route GET /v1/categories/:categoriesId/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = Product.find({ category: req.params.categoryId });
  } else {
    query = Product.find().populate({
      path: 'category',
      select: 'name description ',
      options: { limit: 1 }
    });
  }

  const products = await query;

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/* exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: product });
});

// add a header with:
// @description Create new product
// @route POST /v1/products
// @access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// add a header with:
// @description update product
// @route PUT /v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ sucess: true, data: product });
});

// add a header with:
// @description Delete product
// @route DELETE /v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  product.remove();
  res.status(200).json({ sucess: true, data: {} });
});
 */
