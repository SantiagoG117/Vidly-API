// This module contains all the logic for defining and validating a Customer

const Joi = require("joi");
const mongoose = require("../startup/dbConnection");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
});

const Genres = mongoose.model("Genre", genreSchema);

function validate(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genres = Genres;
exports.validate = validate;
