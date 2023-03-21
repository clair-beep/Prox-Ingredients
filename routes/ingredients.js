const express = require('express');
const Ingredient = require('../models/Ingredient');

const {
  getIngredients,
  getIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} = require('../controllers/ingredients');

//Main Routes - simplified for now

const router = express.Router();

const {
  protect,
  authorize,
  checkExistenceOwnership,
} = require('../middleware/auth');

router
  .route('/')
  .get(getIngredients)
  .post(protect, authorize('publisher', 'admin'), createIngredient);

router
  .route('/:id')
  .get(getIngredient)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Ingredient),
    updateIngredient,
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Ingredient),
    deleteIngredient,
  );

module.exports = router;
