// This module contains all the logic for defining and validating a Customer

const Joi = require("joi");
const mongoose = require("../db/dbConnection");
const Customers = mongoose.model(
  "Customer",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    isGold: {
      type: Boolean,
      required: true,
    },
    phone: {
      type: String,
      maxlength: 15,
      required: true,
    },
  })
);

function validate(customer) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().max(15).required(),
  });

  return schema.validate(customer);
}

exports.Customers = Customers;
exports.validate = validate;
