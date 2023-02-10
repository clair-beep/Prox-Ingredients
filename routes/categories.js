const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');

//Main Routes - simplified for now

const router = express.Router();

router.route('/categories').get(getCategories).post(createCategory);

router
  .route('/categories/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
