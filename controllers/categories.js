const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');

console.log('Testing merge');

exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: category });
});

// add a header with:
// @description Create new category
// @route POST /v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;

  //Check for published categories
  // const publishedCategory = await Category.findOne({ user: req.user.id });
  //If the user is not an admin, they cannot   add a category
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has no the required role to create a category`,
        403,
      ),
    );
  }
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});
// add a header with:
// @description update category
// @route PUT /v1/categorys/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ sucess: true, data: category });
});

// add a header with:
// @description Delete category
// @route DELETE /v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id} `, 404),
    );
  }

  category.remove();

  res.status(200).json({ sucess: true, data: {} });
});
