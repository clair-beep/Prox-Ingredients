const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  englishTitle: {
    type: String,
    trim: true,
    required: [true, 'Please add a ingredient title']
  },

  spanishTitle: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Please add a description']
  },

  references: {
    type: String,
    required: [true, 'Please add the references used']
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
});

module.exports = mongoose.model('ingredient', IngredientSchema);
