//? Build a router
const express = require("express");
const router = express.Router();

//? Middleware
const moment = require("moment");
const authorization = require("../middleware/authorization");
const { Rentals } = require("../models/rentalsModels");
const { Movies } = require("../models/moviesModel");

router.post("/", authorization, async (req, res) => {
  if (!req.body.customerId || !req.body.movieId) return res.status(400).send();

  //Find the rental
  const rental = await Rentals.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("Rental not found");

  //Process rental
  if (rental.rentalFee)
    return res.status(400).send("Returned already processed");

  rental.dateReturned = new Date();
  const daysRented = moment().diff(rental.dateOut, "days");
  rental.rentalFee = daysRented * rental.movie.dailyRentalRate;
  await rental.save();

  //Increase the stock of the movie
  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie not found");
  movie.numberInStock++;
  await movie.save();

  res.status(200).send(rental);
});
module.exports = router;
