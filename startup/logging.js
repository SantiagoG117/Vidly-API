const winston = require("winston");

// ? Silence winston when testing 
if (process.env.NODE_ENV === "test") {
  winston.add(new winston.transports.Console({ silent: true }));
} else {
  winston.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

//? Subscribe to Uncaught Exception and Unhandle Promise Rejection events (exceptions without catch blocks) and handle them with winston
module.exports = function () {
  //process is an event emmiter that allows us to emit or publish events. on() allows us to subscribe to an event
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });
  //? Build transport for logging messages in a file
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
};
