const jwt = require("jsonwebtoken");
const config = require("config");

/* 
?   Middleware function:
    Takes a request object and either returns a response to the client (terminates the req-res life cycle) or passes the control to another Middleware function (next).
*/
function isAdmin(req, res, next) {
  // Assumption: isAdmin is executed after the authorization middleware function, where a payload is assigned to the user property of the request body.
  if (!req.user.isAdmin) {
    console.log(req.user.isAdmin);
    return res.status(403).send("Forbidden: Access denied");
  }

  next(); // Grant access and pass control to the route handler
}

module.exports = isAdmin;
