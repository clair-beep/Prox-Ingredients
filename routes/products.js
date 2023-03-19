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

const { protect } = require('../middleware/auth');

router.route('/').get(getProducts).post(protect, addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router
  .route('/:id/photo')
  .put(protect, upload.single('file'), productPhotoUpload);

module.exports = router;
