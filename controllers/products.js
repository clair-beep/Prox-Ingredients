const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({ success: true, data: products });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(
                new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'This product already exists'
            });
        }

        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};



exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ sucess: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ sucess: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}
