const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const Product = require('../models/Product');

exports.getProducts = asyncHandler(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({ success: true, count: products.length, data: products });

});

exports.getProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: product });

});

exports.createProduct = asyncHandler(async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

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
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ sucess: true, data: product });

});

exports.deleteProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ sucess: true, data: {} });

});
