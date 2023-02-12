const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Category = require('../models/Category');

// add a header with:
// @description Get all products
// @route GET /v1/categories/:categoriesId/products
// @access Public
exports.getProducts = asyncHandler(
  async (req, res, next) => {
    let query;

    if (req.params.categoryId) {
      query = Product.find({
        category: req.params.categoryId
      });
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
  }
);

// add a header with:
// @description Get a single product
// @route GET /v1/product/:id
// @access Public
exports.getProduct = asyncHandler(
  async (req, res, next) => {
    const product = await Product.findById(
      req.params.id
    ).populate({
      path: 'category',
      select: 'name description'
    });

    if (!product) {
      return next(
        new ErrorResponse(
          `No product with the id of ${req.params.id}`
        ),
        404
      );
    }

    res.status(200).json({
      success: true,
      data: product
    });
  }
);

// @description Add a single product
// @route POST /v1/categories/:categoryId/products
// @access Private
exports.addProduct = asyncHandler(
  async (req, res, next) => {
    req.body.category = req.params.categoryId;

    const category = await Category.findById(
      req.params.categoryId
    );

    if (!category) {
      return next(
        new ErrorResponse(
          `No category with the id of ${req.params.categoryId}`
        ),
        404
      );
    }

    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      data: product
    });
  }
);

// @description update a single product
// @route PUT /v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorResponse(
          `No product with the id of ${req.params.id}`
        ),
        404
      );
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: product
    });
  }
);

// @description delete a single product
// @route DELETE /v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(
          `No product with the id of ${req.params.id}`
        ),
        404
      );
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: `Product ${product.name} was deleted`
    });
  }
);
