module.exports = function (app) {
  //Set up routes
  //? Import Routers and other dependencies
  const express = require("express");
  const home = require("../routes/home");
  const genres = require("../routes/genres");
  const customers = require("../routes/customers");
  const movies = require("../routes/movies");
  const rentals = require("../routes/rentals");
  const users = require("../routes/users");
  const auth = require("../routes/auth");
  const error = require("../middleware/error");

  //Set up middleware for routes
  //? Register middleware functions
  app.use(express.json()); // Reads the request and parses it body into a JSON object, setting the req.body object
  app.use("/", home);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  //Error middleware: Must be declared at the end so route handlers can pass control to it in case of errors
  app.use(error);
};
