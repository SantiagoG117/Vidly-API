// This module contains all the logic for defining and validating a Movie

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("../startup/dbConnection");
const { genreSchema } = require("../models/genresModel");

const moviesSchema = mongoose.Schema({
  //Representation of the persistence model in our application.
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  //Complex object. Mongo Schema can grow independent from our Joi schema.
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Movies = mongoose.model("Movie", moviesSchema);

//Validation for the client's input to our API:
function validate(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(), //Client should only send the id of the genre
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

exports.moviesSchema = moviesSchema;
exports.Movies = Movies;
exports.validate = validate;
