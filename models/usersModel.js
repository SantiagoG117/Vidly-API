const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

//? Export the DB connection
const mongoose = require("../startup/dbConnection");

//? Build a schema
const userSchema = mongoose.Schema({
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
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

/*
  ? Add additional methods to the schema
  methods generate an object inside the schema. We can add functions to that object 
  as key-value pair elements. In this case we set the key to generateAuthToken and the 
  value to a function().

  Because we are referencing the current user object through the 'this' keyword, we have to define
  the generateAuthToken function using a normal function definition and not with an arrow function. 
  Arrow functions can't use 'this' to reference the current object. The 'this' keyword in arrow functions 
  references the calling function. That's why they cannot be used to define methods of an object
 */
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

//? Create the model:
const User = mongoose.model("User", userSchema);

//? Create the Joi validation:
function validate(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean().required(),
  });
  return schema.validate(user);
}

//? Export the model and its validation
exports.User = User;
exports.validate = validate;
