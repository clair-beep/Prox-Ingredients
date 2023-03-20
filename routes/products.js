const express = require('express');
const upload = require('../middleware/multer');
const Product = require('../models/Product');

const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
} = require('../controllers/products');

//Main Routes - simplified for now

const router = express.Router({
  mergeParams: true,
});

const {
  protect,
  authorize,
  checkExistenceOwnership,
} = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('publisher', 'admin'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Product),
    updateProduct,
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Product),
    deleteProduct,
  );

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Product),
    upload.single('file'),
    productPhotoUpload,
  );

module.exports = router;
