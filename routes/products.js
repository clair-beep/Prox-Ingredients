const express = require('express');
const upload = require('../middleware/multer');

const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload
} = require('../controllers/products');

//Main Routes - simplified for now

const router = express.Router({
  mergeParams: true
});

router.route('/').get(getProducts).post(addProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

router.put('/:id/photo', upload.single('file'), productPhotoUpload);

module.exports = router;
