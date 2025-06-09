const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

//? Build the connection to MongoDB
const dbConnection = config.get("db");
mongoose
  //Dynamically read the connection string referencing the MongoDB Database that will be used based on the environment in which the application is running
  .connect(dbConnection)
  .then(() => winston.info(`Connected to ${dbConnection}`));

module.exports = mongoose;
