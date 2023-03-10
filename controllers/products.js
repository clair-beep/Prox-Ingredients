const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../middleware/cloudinary');
// add a header with:
// @description Get all products
// @route GET /v1/categories/:categoriesId/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
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
});

// add a header with:
// @description Get a single product
// @route GET /v1/product/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'category',
    select: 'name description'
  });

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @description Add a single product
// @route POST /v1/categories/:categoryId/products
// @access Private
exports.addProduct = asyncHandler(async (req, res, next) => {
  req.body.category = req.params.categoryId;

  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(`No category with the id of ${req.params.categoryId}`),
      404
    );
  }

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @description update a single product
// @route PUT /v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`),
      404
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @description delete a single product
// @route DELETE /v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`),
      404
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: `Product ${product.name} was deleted`
  });
});

// @description update a single product
// @route PUT /v1/products/:id
// @access Private
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  // console.log('this is req.file:', JSON.stringify(req.file, null, 2));

  // If the product is not found, return a 404 error response with an error message
  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure the uploaded file is an image, return a 400 error response with an error message if not
  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  //Make sure the image is a photo
  if (!req.file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check the size of the uploaded file, return a 400 error response with an error message if it's too large
  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Upload the file to Cloudinary using the Cloudinary API and store the result in the `result` variable
  const result = await cloudinary.uploader.upload(req.file.path);
  console.log(result);
  // Set the `product.image` field to the secure URL of the uploaded image and `product.cloudinaryId` to the public ID of the image on Cloudinary
  product.image = result.secure_url;
  product.cloudinaryId = result.public_id;

  // Save the updated `product` object to the database
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});
