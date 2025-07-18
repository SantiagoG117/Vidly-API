//? Set up the router
const express = require("express");
const router = express.Router();

//? Get the Customers model and its validation
const { Customers, validate } = require("../models/customersModel");

//? Middlewares
const authorization = require("../middleware/authorization");
const validateInput = require("../middleware/validate");
const isAdmin = require("../middleware/isAdmin");
const asyncMiddleware = require("../middleware/async");

//? Routes to work with customers
//GET:
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const courses = await Customers.find().sort("name");
    res.send(courses);
  })
);

//GET/id
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    //Get the customer under the provided id route parameter or return 404 if it does not exist
    const customer = await Customers.findById(req.params.id);
    if (!customer)
      res.status(404).send("There is no customer under the provided id.");

    //Return the target customer
    res.send(customer);
  })
);

//POST:
router.post(
  "/",
  [authorization, validateInput(validate)],
  asyncMiddleware(async (req, res) => {
    //Build a customer object mapping the properties of the object sent in the body of the request
    const customer = new Customers({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });

    //Save the customer in the Customers collection
    const result = await customer.save();
    res.send(result);
  })
);

//PUT
router.put(
  "/:id",
  [authorization, validateInput(validate)],
  asyncMiddleware(async (req, res) => {
    //Get the customer under the provided id or return 404 if it does not exist
    const customer = await Customers.findById(req.params.id);
    if (!customer)
      res.status(404).send("There is no customer under the provided id");

    //Update the properties of the customer
    customer.name = req.body.name;
    customer.isGold = req.body.isGold;
    customer.phone = req.body.phone;

    //Save the updated customer back to the collection and return it
    const result = await customer.save();
    res.send(result);
  })
);

//DELETE
router.delete(
  "/:id",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Get the customer under the provided id or return 404 if it does not exist
    const customer = await Customers.findById(req.params.id);
    if (!customer)
      res.status(404).send("There is no customer under the provided id");

    const result = await Customers.deleteOne({ _id: req.params.id });
    if (result.acknowledged) res.send(customer);
    else
      res
        .status(409)
        .send(
          "Request was valid but could not be processed due to a problem on the server. Plase try again later."
        );
  })
);

//?Export the router
module.exports = router;
