const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connectDB };
