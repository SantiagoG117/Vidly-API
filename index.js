require("dotenv").config();
//?Build the server
const express = require("express"); //the express module returns a function
const app = express(); //We can use that function to create an express object called app that will represent our application

//?Middleware: Take a request object and either returns a response to the client or passes the control to another Middleware function
app.use(express.json()); // Reads the request and parses it body into a JSON object, setting the req.body object

//? View Engines
app.set("view engine", "pug");

//? Routers
const home = require("./routes/home");
app.use("/", home);
const genres = require("./routes/genres");
app.use("/api/genres", genres); // For routes starting with /api/genres use the genres router
const customers = require("./routes/customers");
app.use("/api/customers", customers);
const movies = require("./routes/movies");
app.use("/api/movies", movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
