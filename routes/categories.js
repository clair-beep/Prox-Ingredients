const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');

//Include other resource from routers

const productRouter = require('./products');
//Main Routes - simplified for now

const router = express.Router();

//Re-route into other resource routers
router.use(
  '/:categoryId/products',
  productRouter
);

router
  .route('/')
  .get(getCategories)
  .post(createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
