const winston = require("winston");
/* 
?   Middleware function:
    Assumes control of the req-res process and returns a response to the client with a status 500.
    terminating the req-res life cycle.

    This middleware will be activated only for errors that occure in the Request-processing pipeline
    */
function error(err, req, res, next) {
  //Logic for handling errors in our application
  winston.error(err.message, err);
  return res.status(500).send("Something failed. Please try again later");
}

module.exports = error;
