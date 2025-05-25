const winston = require("winston");
/* 
?   Middleware function:
    Takes a request object and either returns a response to the client (terminates the req-res life cycle) or passes the control to another Middleware function (next).
    This middleware will be activated only for errors that occure in the Request-processing pipeline
    */
function error(err, req, res, next) {
  //Logic for handling errors in our application

  winston.error(err.message, err);
  return res.status(500).send("Something failed. Please try again later");
}

module.exports = error;
