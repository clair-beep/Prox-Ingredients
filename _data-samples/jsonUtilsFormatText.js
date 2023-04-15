const fs = require('fs');

// Define function to capitalize first letter after a dot and uppercase remaining letters
// Define function to capitalize first letter after a dot and uppercase remaining letters
function capitalize(str) {
  return str.toLowerCase().replace(/(^|\.)\s*(\w)/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
}

// Read ingredients from ingredients.json file
const ingredientsData = fs.readFileSync('_data-samples/ingredients.json');
const ingredients = JSON.parse(ingredientsData);

// Read products from products.json file
const productsData = fs.readFileSync('_data-samples/products.json');
const products = JSON.parse(productsData);

// Map ingredient names to their corresponding IDs
const ingredientMap = {};
ingredients.forEach((ingredient) => {
  ingredientMap[ingredient.englishTitle.toUpperCase()] = ingredient._id;
});
//console.log(ingredientMap);

// Update product ingredients with their corresponding IDs
products.forEach((product) => {
  const updatedIngredients = product.ingredients.map((ingredientName) => {
    const id = ingredientMap[ingredientName];
    return id ? id : ingredientName; // Return ID if it exists, otherwise return original name
  });

  product.ingredients = updatedIngredients;

  // Capitalize first letter after a dot and lowercase remaining letters in description
  product.description = capitalize(product.description).trim();

  //console.log(product.description);
});

// Write updated products to products-updated.json file
fs.writeFileSync(
  '_data-samples/products-updated.json',
  JSON.stringify(products),
);
