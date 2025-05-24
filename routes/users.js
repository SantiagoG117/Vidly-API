//?Create the router
const express = require("express");
const router = express.Router();

//? Import third party libraries
const lodash = require("lodash");
const bcrypt = require("bcrypt");

//?Import the model and validation
const { User, validate } = require("../models/usersModel");

//? Build routes
//GET
router.get("/", async (req, res) => {
  const registrations = await User.find();
  res.send(registrations);
});

//POST
router.post("/", async (req, res) => {
  //Validate the object in the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Validate that the user does not already exist
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist)
    return res.status(400).send("Email already exists on the server");

  //Build a registration object mapping the properties sent in the request object
  let user = new User(lodash.pick(req.body, ["name", "email", "password"]));

  /* 
    Hash the password:
    Hashing is the process of converting the orignal password into a fixed-length string. It allows us to save passwords in a database in a secure way.
    
    Hashing still have some vulnerabilities, that is why we need a salt. A salt is a random string added at the beginning or end of the original password.
    So the resulting hash would be different each time based on the salt that was used.

    At registration, the password provided by the user is hashed using a salt. We are saving the salt and the hash in the database, not the original password.
  */
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  //Save the user to the Users collection
  user = await user.save();
  /*
    When the user registers, log them in into the application automatically. 
    Resturn the JSON Web token as a header so the client can store it and use it 
    in the future

    By convention all custom headers should be prefix with 'x-'
  */
  const token = user.generateAuthToken();
  //Returned a simplified object to the client algong with the JSON web tocken in a header
  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["_id", "name", "email"]));
});

//?Export router
module.exports = router;
