//? Create the router
const express = require("express");
const router = express.Router();

//? Export third party libraries
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

//? Import the User model
const { User } = require("../models/usersModel");

//? Build routes
router.post("/", async (req, res) => {
  //Validate the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* 
    When authenticating the user, we validate the username and password. 
    The user sends the password in plain text, then the password is hashed and added
    the original salt used for the hashed password in database. Finally bcrypt compare 
    both the sent hashed password with the hashed password stored in the database. If they
    are equal 
  */
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password"); //Invalid request: Do not let the client know that the email does not exist

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password"); //Invalid request: Do not let the client know that the email does not exist

  /* 
    JSON web token: 
    A long string that identifies a user. It can be seen as the personal id of the user.
    When the user logs in, we generate a JSON Web Token on the server. We give it to the client and tell it that it should store that token in memory,
    so it can be provided when accessing any of the endpoints. 

    In other words, the client should store the JSON Web Token provided by the server so it can be send back to the server for future api calls.
        - For web applications, the JSON Web tocken can be stored in the Browser's local storage
        - For mobile applications there is a simmilar way depending on the platform

  */
  //Return the JSON Web token
  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  res.send(token);
});

//? Create the Joi validation:
function validate(request) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(request);
}

//? Export the router
module.exports = router;
