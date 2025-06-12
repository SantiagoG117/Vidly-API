/* 
?   Middleware function:
    Take a request object and either returns a response to the client, terminating the reques-response cycle
    or passes the control the the next Middleware function in the pipeline
*/

const mongoose = require("mongoose");
function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID");
  next();
}

module.exports = validateId;
