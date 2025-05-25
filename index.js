/* 
  index module should be in charge of high level arrangements or orchestration.
  Details should not be declared in this module, instead they should be incapsulated
  in other modules.
*/
const winston = require("winston");
require("dotenv").config();
const config = require("config");
const error = require("./middleware/error");

//?Build the server
const express = require("express"); //the express module returns a function
const app = express(); //We can use that function to create an express object called app that will represent our application

//? Subscribe to Uncaught Exception and Unhandle Promise Rejection  events (exceptions without catch blocks) and handle them with winston
process.on("uncaughtException", (ex) => {
  //process is an event emmiter that allows us to emit or publish events. on() allows us to subscribe to an event
  winston.error(ex.message, ex);
  process.exit(1);
});

//? Build transport for logging messages in a file
winston.add(new winston.transports.File({ filename: "logfile.log" }));

//? View Engines
app.set("view engine", "pug");

//? Import Routers
const home = require("./routes/home");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

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

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
