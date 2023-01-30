const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');

exports.getProducts = asyncHandler(async (req, res, next) => {
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
	query = Product.find(JSON.parse(queryStr));

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
	const limit = parseInt(req.query.limit, 10) || 1;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Product.countDocuments();

	query = query.skip(startIndex).limit(limit);

	//Pagination result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		};
	}

	//Executing query
	const products = await query;

	res.status(200).json({
		success: true,
		count: products.length,
		pagination,
		data: products
	});
});

exports.getProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return next(
			new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
		);
	}
	res
		.status(200)
		.json({ success: true, count: products.length, pagination, data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
	try {
		const product = await Product.create(req.body);
		for (let i = 0; i < req.body.ingredients.length.length; i++) {
			const ingredient = await Ingredient.findById(req.body.ingredients[i]);
			product.ingredients.push(ingredient._id);
		}
		await product.save();
		res.status(201).json({
			success: true,
			data: product
		});
	} catch (err) {
		next(err);
	}
});

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
	product.ingredients = req.body.ingredients;
	await product.save();
	res.status(200).json({ sucess: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);

	if (!product) {
		return next(
			new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ sucess: true, data: {} });
});
