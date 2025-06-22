//? Build a router
const express = require("express");
const router = express.Router();

//? External dependencies
const authorization = require("../middleware/authorization");
const inputValidator = require("../middleware/validate");
const { Rentals, validate } = require("../models/rentalsModels");
const { Movies } = require("../models/moviesModel");

router.post(
  "/",
  [authorization, inputValidator(validate)],
  async (req, res) => {
    //Find the rental
    const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send("Rental not found");

    //Process rental
    if (rental.rentalFee)
      return res.status(400).send("Returned already processed");

    rental.calculateRentalFee();
    await rental.save();

    //Increase the stock of the movie
    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Movie not found");
    movie.numberInStock++;
    await movie.save();

    res.send(rental);
  }
);
module.exports = router;
