const mongoose = require("mongoose");

//? Build the connection to MongoDB
mongoose
  .connect("mongodb://localhost/Vidly") //Connection string referencing the MongoDB Database that will be created for this project
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

//? Models:
const Genres = mongoose.model(
  "Genre",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
    },
  })
);

module.exports = Genres;
