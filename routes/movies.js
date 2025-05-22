//?Build the Router
const express = require("express");
const router = express.Router();

//? Get the MongoDB models
const { Movies, validate } = require("../models/moviesModel");
const { Genres } = require("../models/genresModel");

//? Add routes

//GET
router.get("/", async (req, res) => {
  const movies = await Movies.find().sort("name");
  res.send(movies);
});

//GET/:id
router.get("/:id", async (req, res) => {
  //Get the movie under the id
  const movie = await Movies.findById(req.params.id);
  if (!movie) res.status(404).send("No movie was found under that id");

  res.send(movie);
});

//POST
router.post("/", async (req, res) => {
  //Validate the object sent by the client
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //Find the genre under the id send by the request
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) res.status(400).send("Invalid genre");

  //Build a movies object mapping the properties of the object sent by the client
  const movie = new Movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  //Save the movie in the Movies collection
  const result = await movie.save();
  res.send(result);
});

//PUT
router.put("/:id", async (req, res) => {
  //Validate the object sent in the body of the request
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //Get the movie under the provided id or return 404 if no movie exists
  const movie = await Movies.findById(req.params.id);
  if (!movie) res.status(404).send("No movie was found under the provided id");

  //Get the genre
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) res.status(404).send("Invalid genre");

  //Modify the prioperties of the movie object
  movie.title = req.body.title;
  movie.genre = {
    _id: genre._id,
    name: genre.name,
  };
  movie.numberInStock = req.body.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate;

  //Save the movie back to the movie collection
  const result = await movie.save();
  res.send(result);
});

//DELETE
router.delete("/:id", async (req, res) => {
  //Get the movie under the provided id or return 404 if no movie exist
  const movie = await Movies.findById(req.params.id);
  if (!movie) res.status(404).send("No movie was found under the provided id");

  //Delete the movie
  const result = await Movies.deleteOne({ _id: req.params.id });

  if (result.acknowledged) res.send(movie);
  else
    res
      .status(409)
      .send(
        "Request was valid but could not be processed due to a problem on the server. Plase try again later."
      );
});

module.exports = router;
