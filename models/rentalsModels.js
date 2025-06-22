const Joi = require("joi");
const mongoose = require("../startup/dbConnection");
const moment = require("moment");

//? Build a schema
const rentalSchema = mongoose.Schema({
  /* Create a new customer schema for only the essential properties needed to display a rental */
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  /* Create a new movie schema for only the essential properties needed to display a rental */
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

//? Schema methods
rentalSchema.statics.lookup = function (customerId, movieId) {
  //'this' references the Rental class
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.calculateRentalFee = function () {
  this.dateReturned = new Date();
  
  const daysRented = moment().diff(this.dateOut, "days");
  this.rentalFee = daysRented * this.movie.dailyRentalRate;
};

//? Build the model
const Rentals = mongoose.model("Rental", rentalSchema);

function validate(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.Rentals = Rentals;
exports.validate = validate;
