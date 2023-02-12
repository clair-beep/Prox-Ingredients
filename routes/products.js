const express = require('express');
const {
  getProducts,
  getProduct,
  addProduct
} = require('../controllers/products');

//Main Routes - simplified for now

const router = express.Router({
  mergeParams: true
});

router
  .route('/')
  .get(getProducts)
  .post(addProduct);

router.route('/:id').get(getProduct);

module.exports = router;
