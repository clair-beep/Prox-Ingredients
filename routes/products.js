const express = require('express')
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct

} = require('../controllers/products');

//Main Routes - simplified for now

const router = express.Router()

router
    .route('/products')
    .get(getProducts)
    .post(createProduct);

router
    .route('/products/:category/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);



module.exports = router