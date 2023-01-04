

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
        res
            .status(200)
            .json({ sucess: true, msg: 'Create a new Product' });
    } catch (err) {
        console.log(err)
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