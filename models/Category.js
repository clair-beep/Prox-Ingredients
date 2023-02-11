const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { default: slugify } = require('slugify');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id; // exclude the 'id' field from the output
      }
    },
    toObject: { virtuals: true }
  }
);

//Create product slug from the name
categorySchema.pre('save', function (next) {
  // console.log(('Slugify ran', this.name))
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete products when a category is deleted
categorySchema.pre('remove', async function (next) {
  console.log(`Products being removed from ${this._id}`);
  await this.model('Product').deleteMany({ category: this._id });
  next();
});

//Reverse populate with virtual
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

module.exports = mongoose.model('Category', categorySchema);
