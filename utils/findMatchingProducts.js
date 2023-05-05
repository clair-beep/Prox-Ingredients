const Product = require('../models/Product');

async function getMatchingProducts(req) {
  let products;
  const searchQuery = req.query.q;
  console.log(`searchQuery: ${searchQuery}`);

  if (typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
    products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    }).lean();
    return products;
  } else {
    products = []; // or some default value
    return products;
  }
}

module.exports = {
  getMatchingProducts,
};
