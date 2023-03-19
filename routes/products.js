const express = require('express');
const upload = require('../middleware/multer');

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

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('publisher', 'admin'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('publisher', 'admin'), updateProduct)
  .delete(protect, authorize('publisher', 'admin'), deleteProduct);

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('publisher', 'admin'),
    upload.single('file'),
    productPhotoUpload,
  );

module.exports = router;
