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

//? Get the MongoDB model for genres
const Genre = require("../db/dbConnection");

const Joi = require("joi");

//? Add routes to the router
//GET all
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

//GET one
router.get("/:id", async (req, res) => {
  /* 
    Route parameters: 
    Variables in the URL path that allow us to capture data from the URL and use it
    in the route handler
    
    To access route parameters we must call req.params.id
  */
  //Get the genre under the provided id or return 400 if the genre does not exist
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("There are no genres under the provided id");

  res.send(genre);
});

//POST
router.post("/", async (req, res) => {
  //Validate the object send by the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Build a genre object from the object sent in the body of the request
  const genre = new Genre({
    name: req.body.name,
  });

  //Save the genre to the MongoDB database
  try {
    const result = await genre.save(); //Returns the genre object saved in the database
    //Return the newly created genre in the body of the response
    res.send(result);
  } catch (ex) {
    res.send(ex.errors.message);
  }
});

//PUT
router.put("/:id", async (req, res) => {
  //Validate the object sent in the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Get the genre under the provided id or return 400 if the genre does not exist
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("There are no genres under the provided id");

  //Modify the properties of the object
  genre.name = req.body.name;

  //Save the object back to the collection and return it
  const result = await genre.save();
  res.send(result);
});

//DELETE
router.delete("/:id", async (req, res) => {
  //Get the genre under the provided id or return 400 if the genre does not exist
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("There are no genres under the provided id");

  const result = await Genre.deleteOne({ _id: genre.id });

  if (result.acknowledged) res.send(genre);
  else
    res
      .status(409)
      .send(
        "Request is valid but cannot be processed due to a problem on the serve"
      );
});

//* Global functions
function validate(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

//? Export the router:
module.exports = router;
