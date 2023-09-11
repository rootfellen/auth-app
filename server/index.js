require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middleware/error-middleware");

const PORT = process.env.PORT || 7700;
const app = express();

// connecting middleware

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware); //should be in the end

const start = async () => {
  try {
    // connect to db
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // initialize server
    app.listen(PORT, () => console.log(`Server is running on PORT = ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
