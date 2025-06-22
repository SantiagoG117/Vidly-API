/* 
  index module should be in charge of high level arrangements and orchestration of concerns.
  Details should not be declared in this module, instead they should be encapsulated in other modules.
*/

require("dotenv").config();
const winston = require("winston");

//?Build the server
const express = require("express"); //the express module returns a function
const app = express(); //We can use that function to create an express object called app that will represent our application

//? Load the logging module
require("./startup/logging")();
//? Load the routes module
require("./startup/routes")(app);
//? Load config module
require("./startup/config");

//? Load the production middleware
require("./startup/production")(app);

//? View Engines
app.set("view engine", "pug");

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);

module.exports = server;
