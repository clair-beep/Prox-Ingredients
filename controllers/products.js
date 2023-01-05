const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        res
            .status(200)
            .json({ sucess: true, msg: 'Show all Products' });
    } catch (err) {
        console.log(err)
    }
}

exports.getProduct = async (req, res, next) => {
    try {
        res
            .status(200)
            .json({ sucess: true, msg: `Show ${req.params.id}` });
    } catch (err) {
        console.log(err)
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
        res
            .status(200)
            .json({ sucess: true, msg: `Update Product${req.params.id}` });
    } catch (err) {
        console.log(err)
    }

};

exports.deleteProduct = async (req, res, next) => {
    try {
        res
            .status(200)
            .json({ sucess: true, msg: `Delete Product ${req.params.id}` });
    } catch (err) {
        console.log(err)
    }

};