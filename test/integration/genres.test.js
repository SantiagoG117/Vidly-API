//? Models and third party libraries
const request = require("supertest"); //Allows us to send requests to endpoints
const mongoose = require("mongoose");
const { Genres } = require("../../models/genresModel");
const { User } = require("../../models/usersModel");

let server;

//? Test Suite: Container for testing HTTP requests to the /genres endpoint
describe("/api/genres", () => {
  //* Load the server before each test and close it after each test is completed
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    //Clean up the genres test collection
    await Genres.deleteMany();
  });

  //* Test HTTP requests
  describe("GET /", () => {
    it("should return all Genres", async () => {
      //Prepopulate the Genres test collection
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      // Send a http request to an enpoint we wish to test
      const res = await request(server).get("/api/genres");
      // Make an assertion that include inspecting the external resource
      expect(res.status).toBe(200);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the Genre under the provided id", async () => {
      //Create the Genre
      const genre = {
        _id: new mongoose.Types.ObjectId(),
        name: "Genre1",
      };
      //Add the genre to the test collection
      await Genres.collection.insertMany([genre]);

      //Send a http request to the endpoint to be tested
      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body._id === genre._id.toHexString()).toBeTruthy();
    });

    it("should return 404 if there is no genre under the id", async () => {
      const _id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${_id}`);
      expect(res.status).toBe(404);
    });

    describe("POST", () => {
      /* 
        1. Define the happy path
        2. In each test, change one parameter that clearly aligns with the name of the test.
      */

      it("should return 401 if the user is not authorized", async () => {
        const res = await request(server)
          .post("/api/genres")
          .send({ name: "genre1" });

        expect(res.status).toBe(401);
      });

      it("should return 400 if genre is less than 3 characters", async () => {
        //Build the token
        const token = new User().generateAuthToken();

        //Send the test request
        const res = await request(server)
          .post("/api/genres")
          .set("x-auth-token", token) //Include the token in the request
          .send({ name: "ab" });

        expect(res.status).toBe(400);
      });

      it("should save the genre in the database if it is valid", async () => {
        //Build the token
        const token = new User().generateAuthToken();

        //Send the test request
        const res = await request(server)
          .post("/api/genres")
          .set("x-auth-token", token) //Include the token in the request
          .send({ name: "Genre1" });

        //Query the database
        const genre = await Genres.find({ name: "genre1" });

        expect(genre).not.toBeNull();
      });

      it("should return 200 after the genre is stored in the database", async () => {
        //Build the token
        const token = new User().generateAuthToken();

        //Send the test request
        const res = await request(server)
          .post("/api/genres")
          .set("x-auth-token", token)
          .send({ name: "Genre1" });

        //Assertion
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("name", "Genre1");
      });
    });
  });
});
