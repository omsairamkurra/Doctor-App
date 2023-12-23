const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.js");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", require("./routes/userRoute"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on Port ${process.env.PORT}`
      .bgCyan.white
  );
});
