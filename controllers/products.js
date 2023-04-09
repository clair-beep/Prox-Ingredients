const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const Category = require('../models/Category');
const cloudinary = require('../middleware/cloudinary');
const {
  mapIngredientData,
  sortAndMapIngredientsData,
} = require('../utils/mapIngredientData');

const productService = require('../utils/productService');

// add a header with:
// @description Get all products
// @route GET /v1/categories/:categoriesId/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let categoryId = req.params.categoryId;
  let products, ingredients, categories;

  if (categoryId) {
    try {
      products = await Product.find({ category: categoryId });
      const { mappedIngredients, categoryData } =
        await productService.getIngredientsAndCategories();
      const { brands } = await productService.getProductData();
      ingredients = mappedIngredients;
      categories = categoryData;

      let latestProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(6);
      let productData = products.map((product) => product.toJSON());
      let latestProductData = latestProducts.map((product) => product.toJSON());
      return res.render('product-categories', {
        productsbyCategory: productData,
        latestProducts: latestProductData,
        brands,
        ingredients,
        categories,
      });
    } catch (err) {
      return next(err);
    }
  }

  try {
    const { mappedIngredients, categoryData } =
      await productService.getIngredientsAndCategories();
    ingredients = mappedIngredients;
    categories = categoryData;

    const { products, brands } = await productService.getProductData();

    let randomProducts = await Product.aggregate([{ $sample: { size: 9 } }]);
    let latestProducts = await Product.find().sort({ createdAt: -1 }).limit(6);

    let productData = products.map((product) => product.toJSON());
    let latestProductData = latestProducts.map((product) => product.toJSON());

    return res.render('main', {
      products: productData,
      latestProducts: latestProductData,
      randomProducts,
      categories,
      brands,
      ingredients,
    });
  } catch (err) {
    console.log('error');
    return next(err);
  }
});

// add a header with:
// @description Get a single product
// @route GET /v1/product/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    let product;

    product = await Product.findById(id)
      .populate('ingredients')
      .populate('category');
    if (!product) {
      return next(new ErrorResponse('ValidationError'), 401);
    } else {
      const mappedIngredients = sortAndMapIngredientsData(product.ingredients);
      let productData = {
        id: product._id,
        name: product.name,
        category: product.category.name,
        categoryId: product.category._id,
        description: product.description,
        image: product.image,
        brand: product.brand,
        brandCountry: product.brandCountry,
      };

      // Find other products with the same category
      const relatedProducts = await Product.find({
        category: product.category._id,
      })
        .limit(3)
        .lean();
      const { brands } = await productService.getProductData();

      // limit the number of related products to 3
      console.log(`relatedProducts: ${relatedProducts}`);
      res.render('product-overview', {
        product: productData,
        ingredients: mappedIngredients,
        relatedProducts: relatedProducts,
        brands,
      });
    }
  } catch (err) {
    next(err);
  }
});

// @route GET /v1/products/search
// @access Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  let products, ingredients, categories;
  const searchQuery = req.query.q;
  console.log(`searchQuery: ${searchQuery}`);
  try {
    const { mappedIngredients, categoryData } =
      await productService.getIngredientsAndCategories();
    ingredients = mappedIngredients;
    categories = categoryData;
    const { brands } = await productService.getProductData();

    if (typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
      products = await Product.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { brand: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      }).lean();
    } else {
      products = []; // or some default value
    }
    res.render('search', {
      query: searchQuery,
      products: products,
      categories,
      brands,
      ingredients,
    });
  } catch (err) {
    console.log('error');
    return next(err);
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
