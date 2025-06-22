//? Third party libraries and models
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/usersModel");
const { Rentals } = require("../../models/rentalsModels");

//? Testing suite
describe("/api/rentals", () => {
  //? Suite level: Before and after each logic
  beforeEach(() => {
    // Start up the server
    server = require("../../index");
  });

  afterEach(async () => {
    // Close server and clean up the test database
    await server.close();
    await Rentals.deleteMany();
  });

  describe("POST /", () => {
    //? Testing variables
    let token;
    let customerId;
    let movieId;

    //? Request level: Before each logic
    beforeEach(() => {
      //Initialize the token
      token = new User().generateAuthToken();

      //Initialize the customerId and movieId
      customerId = new mongoose.Types.ObjectId();
      movieId = new mongoose.Types.ObjectId();
    });

    //? Test request
    const testPostRequest = (customerId, movieId) => {
      return request(server)
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send({ customerId, movieId });
    };

    it("should return 400 if the customerId is not provided", async () => {
      const res = await testPostRequest(movieId);
      expect(res.status).toBe(400);
    });

    it("should return 400 if the movieId is not provided", async () => {
      const res = await testPostRequest(customerId);
      expect(res.status).toBe(400);
    });
  });
});
