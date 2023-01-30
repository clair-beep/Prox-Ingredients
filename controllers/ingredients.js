// Import the necessary modules
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');

exports.getIngredients = asyncHandler(async (req, res, next) => {
	const ingredients = await Ingredient.find();

	res
		.status(200)
		.json({ success: true, count: ingredients.length, data: ingredients });
});

exports.getIngredient = asyncHandler(async (req, res, next) => {
	const ingredient = await Ingredient.findById(req.params.id);
	if (!ingredient) {
		return next(
			new ErrorResponse(`Ingredient not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: ingredient });
});

exports.createIngredient = asyncHandler(async (req, res, next) => {
	try {
		const ingredient = await Ingredient.create(req.body);

		res.status(201).json({
			success: true,
			data: ingredient
		});
	} catch (err) {
		next(err);
	}
});

exports.updateIngredient = asyncHandler(async (req, res, next) => {
	const ingredient = await Ingredient.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
			runValidators: true
		}
	);

	if (!ingredient) {
		return next(
			new ErrorResponse(`Ingredient not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ sucess: true, data: ingredient });
});

exports.deleteIngredient = asyncHandler(async (req, res, next) => {
	const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

	if (!ingredient) {
		return next(
			new ErrorResponse(`Ingredient not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ sucess: true, data: {} });
});
