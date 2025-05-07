require("dotenv").config();
const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

const genres = [
  { id: 1, name: "Horror" },
  { id: 2, name: "Action" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Sci-Fi" },
];

//? Global functions
function validate(genre) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
  });
  return schema.validate(genre);
}

function getGenre(genres, genreId) {
  return genres.find((genre) => genre.id === parseInt(genreId));
}

//GET all
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

//GET one
app.get("/api/genres/:id", (req, res) => {
  //Find the requested genre or return 404 if the genre does not exist
  const genre = getGenre(genres, req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given id was not found");

  res.send(genre);
});

//POST
app.post("/api/genres/", (req, res) => {
  //Validate the object send by the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Build a genre object from the object sent in the body of the request
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  //Add the new object to the genres and return it in the body of the response. We return it because the client often needs to know the id of the new object
  genres.push(genre);
  res.send(genre);
});

//PUT
app.put("/api/genres/:id", (req, res) => {
  //Look up for the existing genre or return 404 if it was not found
  const genre = getGenre(genres, req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given id was not found");

  //Validate the object sent in the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Update the genre and return it
  genre.name = req.body.name;
  res.send(genre);
});

//DELETE
app.delete("/api/genres/:id", (req, res) => {
  //Lookup for the existing genre or return 404 if it is not found
  const genre = getGenre(genres, req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given id was not found");

  //Remove the course and return it
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});
