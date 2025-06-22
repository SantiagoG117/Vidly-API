/*
?   Factory function:
    Each route handler has a different validator function. To dynamically validate the input we must pass the validator as a parameter
    and return a reference to a middleware function. At runtime, Express will call this function reference and pass the values for the
    req, res, next parameters.
*/

module.exports = function (validator) {
  return async (req, res, next) => {
    const { error } = validator(req.body); //At runtime the validator function will be called with the value for res provided by Express
    if (error) res.status(400).send(error.details[0].message);
    next();// If no error was returned by the validator, pass control to the next middleware
  };
};
