//? Built the router
const express = require("express");
const router = express.Router();

//? Add routes to the Home router
router.get("/", (req, res) => {
  res.render("index", {
    title: "Vidly API",
    message: "Welcome to Vidly!",
  });
});

//?Export the router
module.exports = router;
