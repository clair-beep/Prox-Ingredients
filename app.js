const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//route files
const getRoutes = require('./routes/index');
const products = require('./routes/products');
const ingredients = require('./routes/ingredients');
const categories = require('./routes/categories');
const auth = require('./routes/auth');

//Use .env file in config folder
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

//body parser
app.use(express.json());

//loggers/ messages that allow you to return

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Handlebars
app.engine(
  '.hbs',
  exphbs.engine({
    //this is the defaut layout passed every time
    defaultLayout: 'main',
    extname: '.hbs',
  }),
);
// doing this will set for handle bars to look for a folder called 'views'
app.set('view engine', '.hbs');

//Static Folder
app.use(express.static('public'));

app.use(express.static(__dirname + '/node_modules/bootstrap-icons/'));

app.use(express.static(__dirname + '/node_modules/bootstrap/'));

//Mount routers
app.use('/v1/', getRoutes);
app.use('/v1/products', products);
app.use('/v1/ingredients', ingredients);
app.use('/v1/categories', categories);
app.use('/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow,
  ),
);

// Handle unhandled promise rejections
process.on('unhandled rejection', (err, promise) => {
  console.log(`Error ${err.message}.red`);
  //close server &exis process
  server.close(() => process.exit(1));
});
