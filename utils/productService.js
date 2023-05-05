const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const Category = require('../models/Category');
const {
  mapIngredientData,
  sortAndMapIngredientsData,
} = require('../utils/mapIngredientData');

async function getIngredientsAndCategories() {
  const ingredients = await Ingredient.find();
  const mappedIngredients = sortAndMapIngredientsData(ingredients);
  const categories = await Category.find().populate('products');
  const categoryData = categories.map((category) => ({
    id: category._id,
    name: category.name,
    description: category.description,
    productCount: category.products.length,
  }));
  return { mappedIngredients, categoryData };
}

async function getProductData() {
  let brandProductCounts = {};
  const products = await Product.find();
  const brands = Array.from(
    new Set(
      products.map(
        (product) =>
          product.brand[0].toUpperCase() + product.brand.slice(1).toLowerCase(),
      ),
    ),
  );

  for (let product of products) {
    let brand =
      product.brand[0].toUpperCase() + product.brand.slice(1).toLowerCase();
    brandProductCounts[brand] = brandProductCounts[brand] + 1 || 1;
  }

  return { products, brands, brandProductCounts };
}

module.exports = {
  getProductData,
  getIngredientsAndCategories,
};
