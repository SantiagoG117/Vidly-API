/* 
  Every file in a Node application is considered a module.
  
  Node automatically wraps the code in each file with an IIFE (Immediatelly Invoked Function Expression)
  to create the scope of the module. 

  Variables and functions defined in a file are only scoped to that file and are not visible to other modules.
  To export a a variable or function from a module we need to add them to module.exports
*/
//? Build the Router: Modular version of an Express application used to handle routing for a specific endpoint, allowing to define routes and middle ware in a modular and orgnized way
const express = require("express");
const router = express.Router();

//? Get the genres model and its validation
const { Genres, validate } = require("../models/genresModel");

//? Export middleware
const asyncMiddleware = require("../middleware/async");
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
const mongoose = require("mongoose");

//? Add routes to the router
//GET all
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genres = await Genres.find().sort("name");
    res.send(genres);
  })
);

//GET/:id
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    /* 
    Route parameters: 
    Variables in the URL path that allow us to capture data from the URL and use it
    in the route handler
    
    To access route parameters we must call req.params.id
  */

    //Verify the id is a valid MongoDB id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send("Invalid ID.");

    //Get the genre under the provided id or return 404 if the genre does not exist
    const genre = await Genres.findById(req.params.id);
    if (!genre)
      return res.status(404).send("There are no genres under the provided id");

    res.send(genre);
  })
);

//POST
router.post(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    //Validate the object send by the request
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    //Build a genre object mapping the properties of the object sent in the body of the request
    const genre = new Genres({
      name: req.body.name,
    });

    //Save the genre to the Genres collection
    const result = await genre.save(); //Returns the genre object saved in the database
    //Return the newly created genre in the body of the response
    res.send(result);
  })
);

//PUT
router.put(
  "/:id",
  authorization,
  asyncMiddleware(async (req, res) => {
    //Validate the object sent in the body of the request
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    //Get the genre under the provided id or return 404 if the genre does not exist
    const genre = await Genres.findById(req.params.id);
    if (!genre)
      res.status(404).send("There are no genre under the provided id");

    //Modify the properties of the object
    genre.name = req.body.name;

    //Save the object back to the collection and return it
    const result = await genre.save();
    res.send(result);
  })
);

//DELETE
router.delete(
  "/:id",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Get the genre under the provided id or return 404 if the genre does not exist
    const genre = await Genres.findById(req.params.id);
    if (!genre)
      res.status(404).send("There are no genres under the provided id");

    const result = await Genres.deleteOne({ _id: genre.id });

    if (result.acknowledged) res.send(genre);
    else
      res
        .status(409)
        .send(
          "Request was valid but could not be processed due to a problem on the server. Plase try again later."
        );
  })
);

//? Export the router:
module.exports = router;
