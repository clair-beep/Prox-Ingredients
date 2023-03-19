const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');

//Include other resource from routers

const productRouter = require('./products');
//Main Routes - simplified for now

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:categoryId/products', productRouter);

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('publisher', 'admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('publisher', 'admin'), updateCategory)
  .delete(protect, authorize('publisher', 'admin'), deleteCategory);

module.exports = router;
