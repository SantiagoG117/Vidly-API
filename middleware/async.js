//Factory function that takes a reference to route handler function and returns an anonymous function calling the route handler
module.exports = function asyncMiddleware(routeHandler) {
  /* 
    Wrapps the route handler into another route handler function that provides the req, res and next parameters and calls the handler.
    At runtime Express will called the wrapper route handler
    */
  return async (req, res, next) => {
    try {
      await routeHandler(req, res); //Call the route handler
    } catch (ex) {
      //Catch the error or the rejected promise and pass it to the Express error-handling middleware
      next(ex); //Pass control to the error middleware with the exception
    }
  };
};
