const mongoose = require("mongoose");
const winston = require("winston");

//? Build the connection to MongoDB
mongoose
  .connect("mongodb://localhost/Vidly") //Connection string referencing the MongoDB Database that will be created for this project
  .then(() => winston.info("Connected to MongoDB"));

module.exports = mongoose;
