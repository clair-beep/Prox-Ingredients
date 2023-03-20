const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');

exports.getCategories = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Finding rescource
  //products being passed is a virtual reourse
  query = Category.find(JSON.parse(queryStr)).populate('products');

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
    // console.log(fields)
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  //set up the limit of elements per page
  const limit = parseInt(req.query.limit, 10) || 20;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Category.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //Executing query
  const categories = await query;

  res.status(200).json({
    success: true,
    count: categories.length,
    pagination,
    data: categories,
  });
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
