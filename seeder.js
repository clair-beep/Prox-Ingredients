const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
mongoose.set('strictQuery', false);

// Load env vars
dotenv.config({ path: './config/config.env' });

//Load models
const Product = require('./models/Product');
const Ingredient = require('./models/Ingredient');

//Connect to DB
mongoose.connect(process.env.MONGO_URI);

//Read JSON files
const products = JSON.parse(
	fs.readFileSync(`${__dirname}/_data-samples/products.json`, 'utf-8')
);

const ingredients = JSON.parse(
	fs.readFileSync(`${__dirname}/_data-samples/ingredients.json`, 'utf-8')
);

//Import into DB
const importData = async () => {
	try {
		await Product.create(products);
		await Ingredient.create(ingredients);

		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

//Delete data
const deleteData = async () => {
	try {
		await Product.deleteMany();
		await Ingredient.deleteMany();
		console.log('Data Destroyed...'.red.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
