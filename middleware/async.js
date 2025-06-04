/* 
  Factory function: Returns a reference of a route handler function (which is async by default) that takes the req, res, next parameters. 
  At runtime, Express will call this function reference and pass the values for the req, res, next parameters, 
  which are require to execute the logic of each route handler or pass control to the Error middleware in case of 
  rejected promises. 
*/
module.exports = function (routeHandler) {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res); //At runtime the routeHandler is called with the values for req, res provided by Express
    } catch (ex) {
      //Catch the error of the rejected promise and pass control to the Express error middleware with the exception
      next(ex); //The value for next() is provided by Express at runtime.
    }
  };
};
