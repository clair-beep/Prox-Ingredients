const express = require('express');
const {
	getIngredients,
	getIngredient,
	createIngredient,
	updateIngredient,
	deleteIngredient
} = require('../controllers/ingredients');

//Main Routes - simplified for now

const router = express.Router();

router.route('/ingredients').get(getIngredients).post(createIngredient);

router
	.route('/ingredients/:id')
	.get(getIngredient)
	.put(updateIngredient)
	.delete(deleteIngredient);

module.exports = router;
