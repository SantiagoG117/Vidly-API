//? Build the router
const express = require("express");
const router = express.Router();

const { Rentals, validate } = require("../models/rentalsModels");
const { Customers } = require("../models/customersModel");
const { Movies } = require("../models/moviesModel");

//Create a new rental
//Post to /api/rentals

//Get the list of rentals
//GET /api/rentals

//? Routes
//GET
router.get("/", async (req, res) => {
  const rentals = await Rentals.find().sort("-dateOut");
  res.send(rentals);
});

//POST
router.post("/", async (req, res) => {
  //Validate the object sent by the client request
  const { error } = validate(req.body);
  if (error) res.send(error.details[0].message);

  //Find the customer under the customer ID sent by the request
  const customer = await Customers.findById(req.body.customerId);
  if (!customer) res.status(404).send("Invalid customer ID");

  //Find the movie under the movie ID sent by the request
  const movie = await Movies.findById(req.body.movieId);
  if (!movie) res.status(404).send("Invalid movie ID");

  if (movie.numberInStock === 0) res.status(400).send("Movie not in stock");

  //Build a Rental object with the properties sent by the request
  const rental = new Rentals({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  //Update the number of movies in stock
  movie.numberInStock--;
  movie.save();

  //Save the object to the Rentals collection
  const result = await rental.save();
  res.send(result);
});

module.exports = router;
