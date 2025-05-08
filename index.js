require("dotenv").config();
//?Build the server
const express = require("express");
const app = express();
//? Routers
const genres = require("./routes/genres");

//?Middleware: Take a request object and either returns a response to the client or passes the control to another Middleware function
app.use(express.json()); // Reads the request and parses it body into a JSON object, setting the req.body object
app.use("/api/genres", genres); // For routes starting with /api/genres use the genres router


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
