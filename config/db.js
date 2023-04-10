const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    //! Additional properties no longer needed.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const url = `http://localhost:${process.env.PORT}`;
    console.log(
      `MongoDB Connected. Servers running in ${url.red.underline.bold}`.cyan
        .bold,
    );
  } catch (err) {
    console.error(`MongoDB Connected: ${err}`.red.underline.bold);
    process.exit(1);
  }
};

//exporting this file to use elsewhere
module.exports = connectDB;
