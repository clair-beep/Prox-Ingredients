const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const Category = require('../models/Category');
const cloudinary = require('../middleware/cloudinary');
const mapIngredientData = require('../utils/mapIngredientData');

// add a header with:
// @description Get all products
// @route GET /v1/categories/:categoriesId/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const products = await Product.find({ category: req.params.categoryId });

    res.render('product-categories', {
      products: products.map((product) => product.toJSON()),
    });
  } else {
    const ingredients = await Ingredient.find();
    const ingredientsData = ingredients
      .map((ingredient) => {
        return {
          id: ingredient._id,
          name:
            ingredient.spanishTitle === 'N/A'
              ? ingredient.englishTitle
              : ingredient.spanishTitle,
          description: ingredient.description,
          source: ingredient.references,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const products = await Product.find();
    console.log(products);

    const randomProducts = await Product.aggregate([{ $sample: { size: 9 } }]);
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(6);

    const categories = await Category.find().populate('products');
    const categoryData = categories.map((category) => {
      return {
        id: category._id,
        name: category.name,
        description: category.description,
        productCount: category.products.length,
      };
    });
    const brands = Array.from(
      new Set(
        products.map(
          (product) =>
            product.brand[0].toUpperCase() +
            product.brand.slice(1).toLowerCase(),
        ),
      ),
    );
    res.render('main', {
      products: products.map((product) => product.toJSON()),
      latestProducts: latestProducts.map((product) => product.toJSON()),

      randomProducts,
      categories: categoryData,
      brands: brands,
      ingredients: ingredientsData,
    });
  }
});

// add a header with:
// @description Get a single product
// @route GET /v1/product/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let product = await Product.findById(id).populate('ingredients');
  if (!product) {
    res.render('error/404', {
      message: `${id}`,
    });
  } else {
    const mappedIngredients = product.ingredients.map(mapIngredientData);
    res.render('product-overview', {
      product,
      mappedIngredients,
    });
  }
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
      404,
    );
  }

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
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
      404,
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
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
      404,
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: `Product ${product.name} was deleted`,
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
      404,
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
        400,
      ),
    );
  }

  // Upload the file to Cloudinary using the Cloudinary API and store the result in the `result` variable
  const result = await cloudinary.uploader.upload(req.file.path);
  // Set the `product.image` field to the secure URL of the uploaded image and `product.cloudinaryId` to the public ID of the image on Cloudinary
  product.image = result.secure_url;
  product.cloudinaryId = result.public_id;

  // Save the updated `product` object to the database
  await product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});
