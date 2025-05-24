const jwt = require("jsonwebtoken");
const config = require("config");

/* 
?   Middleware function:
    Takes a request object and either returns a response to the client (terminates the req-res life cycle) or passes the control to another Middleware function (next).
*/

function auth(req, res, next) {
  //Read the request header to find the JSON Web Token
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access denied. Token is not provided.");

  //Verify that the token is valid. If valid it will return the decoded payload, otherwise it will return an exception
  try {
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    //Attach the decoded payload to the request object as a property called user. Allowing us to access the authenticated user's info
    req.user = payload;
    //Pass control to the route handler(the next middleware function in the Request Processing Pipeline)
    next();
  } catch (ex) {
    res.status(400).send("Invalid token"); //400 Bad request
  }
}

module.exports = auth;
