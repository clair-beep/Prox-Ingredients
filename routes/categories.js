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

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');

//Re-route into other resource routers
router.use('/:categoryId/products', productRouter);

router
  .route('/')
  .get(advancedResults(Category, 'products'), getCategories)
  .post(protect, authorize('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
