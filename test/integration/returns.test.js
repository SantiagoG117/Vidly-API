/* 
    ? Return a movie:

    We calculate the price of a rental by calculating the difference between dateReturned
    and dateOut, and then multiply it by rentalFee. In our API architecture, we should not
    allowed the client to set this values because he could set 0 to rentalFee. These values
    should be calculated and set on the server.

    For this reason we should create a new endpoint api/returns and POST a request with
    the combination of customerId and movieId. 

    On the server we look for a rental with the same customerId - movieId combination and set
    the return date and the rentalFee

    Negative Test cases:
        * User should be authorized (401 if client is not logged in)
        * CustomerId must be provided
        * MovieId must be provided
        * CustomerId should be valid (400)
        * MovieId should be valid (400)
        * Rental with customerId and movieId doe not exist (404)
        * Rental was already processed (400)
    Positive Test cases:
        * Request is valid (200)
        * Returned date is set
        * Rental fee is calculated
        * Stock is increased
        * Rental object is returned
*/
//? This party libraries and models
const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");
const { Rentals } = require("../../models/rentalsModels");
const { User } = require("../../models/usersModel");
const { Movies } = require("../../models/moviesModel");
const { Genres } = require("../../models/genresModel");

describe("/api/returns", () => {
  //? Before and after each logic 
  beforeEach(() => {
    // Start up the server
    server = require("../../index");
  });
  afterEach(async () => {
    //Close the server and up the test database
    await server.close();
    await Rentals.deleteMany();
    await Movies.deleteMany();
  });

  describe("POST /", () => {
    //? Build happy path variables
    let token;
    let rental;
    let customerId;
    let movieId;
    let customer;
    let movie;

    //? Build beforeEach logic
    beforeEach(async () => {
      //Initialize the token
      token = new User().generateAuthToken();

      //Initialize customerId
      customerId = new mongoose.Types.ObjectId();

      //Build the movie object
      movieId = new mongoose.Types.ObjectId();
      movie = new Movies({
        _id: movieId,
        title: "Movie title",
        genre: new Genres({ name: "Genre1" }),
        numberInStock: 1,
        dailyRentalRate: 2,
      });

      //Build the customer object:
      customer = {
        _id: customerId.toHexString(),
        isGold: false,
        name: "Customer Name",
        phone: "12345",
      };

      //Build the rental object
      rental = new Rentals({
        customer: customer,
        movie: {
          _id: movieId,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
        dateOut: new Date(),
      });

      //Save the rental and the movie to the database
      await movie.save();
      await rental.save();
    });

    //? Build test request
    const testPostRequest = (customerId, movieId) => {
      return request(server)
        .post("/api/returns")
        .set("x-auth-token", token)
        .send({ customerId, movieId });
    };

    it("should return 401 if the client is not authorized", async () => {
      token = "";
      const res = await testPostRequest();
      expect(res.status).toBe(401);
    });

    it("should return 400 if the customerId is not provided", async () => {
      const res = await testPostRequest(movieId);
      expect(res.status).toBe(400);
    });

    it("should return 400 if the movie_id is not provided", async () => {
      const res = await testPostRequest(customerId);

      expect(res.status).toBe(400);
    });

    it("should return 404 if rental with customerId and movieId does not exist", async () => {
      //Build new customerId and movieId
      customerId = new mongoose.Types.ObjectId();
      movieId = new mongoose.Types.ObjectId();

      const res = await testPostRequest(customerId, movieId);
      expect(res.status).toBe(404);
    });

    it("should return 400 if the rental was already processed", async () => {
      rental.dateReturned = new Date();
      rental.rentalFee = 1;

      await rental.save();

      const res = await testPostRequest();

      expect(res.status).toBe(400);
    });

    it("should return 200 if the rental was processed sucessfully", async () => {
      const res = await testPostRequest(customerId, movieId);
      expect(res.status).toBe(200);
    });

    it("should set the return date of the rental", async () => {
      const res = await testPostRequest(customerId, movieId);
      //Transform the return date to a date type
      const returnedDate = new Date(res.body.dateReturned);
      //Verify that return date is a valid date
      expect(returnedDate instanceof Date && !isNaN(returnedDate)).toBe(true);
    });

    it("should calculate the rental fee if input is valid", async () => {
      /* 
        To test a scenario where the rental has been out at least one day we must
        reset the date out to the past
      */
      rental.dateOut = moment().add(-7, "days").toDate();
      await rental.save();
      const res = await testPostRequest(customerId, movieId);
      expect(typeof res.body.rentalFee).toBe("number");
      expect(res.body.rentalFee).toBe(14);
    });

    it(`it should increase the movie's stock by 1`, async () => {
      await testPostRequest(customerId, movieId);
      //Set as movie the updated movie object modified in the /returns route
      movie = await Movies.findById(movieId);
      expect(movie.numberInStock).toBe(2);
    });

    it(`should return the rental object`, async () => {
      const res = await testPostRequest(customerId, movieId);

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("dateOut");
      expect(res.body).toHaveProperty("dateReturned");
      expect(res.body).toHaveProperty("rentalFee");
      expect(res.body).toHaveProperty("customer", customer);
      expect(res.body).toHaveProperty("movie", {
        _id: movieId.toHexString(),
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      });
    });
  });
});
