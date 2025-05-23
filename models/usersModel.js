/* 
    TODO: 
        ! Add an endpoint to register users:  
            - POST /api/users to create a new user (new resource)
*/
const Joi = require("joi");
//? Export the DB connection
const mongoose = require("../db/dbConnection");

//? Create the model:
const User = mongoose.model(
  "User",
  mongoose.Schema({
    name: {
      type: String,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      unique: true,
      minLenght: 10,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
  })
);

//? Create the Joi validation:
function validate(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

//? Export the model and its validation
exports.User = User;
exports.validate = validate;
