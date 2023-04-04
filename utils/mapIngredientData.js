function mapIngredientData(ingredient) {
  return {
    id: ingredient._id,
    name:
      ingredient.spanishTitle === 'N/A'
        ? ingredient.englishTitle
        : ingredient.spanishTitle,
    description: ingredient.description,
    references: ingredient.references,
  };
}

function sortAndMapIngredientsData(ingredients) {
  return ingredients
    .map(mapIngredientData)
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { mapIngredientData, sortAndMapIngredientsData };
