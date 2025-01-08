const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URL);
    console.log(`Databse connected`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
