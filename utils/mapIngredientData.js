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

module.exports = mapIngredientData;
