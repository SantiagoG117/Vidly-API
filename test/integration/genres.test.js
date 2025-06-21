//? Models and third party libraries
const request = require("supertest"); //Allows us to send requests to endpoints
const mongoose = require("mongoose");
const { Genres } = require("../../models/genresModel");
const { User } = require("../../models/usersModel");
const isAdmin = require("../../middleware/isAdmin");

let server;

//? Test Suite: Container for testing HTTP requests to the /genres endpoint
describe("/api/genres", () => {
  //? Load the server before each test and close it after each test is completed
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    //Clean up the genres test collection
    await Genres.deleteMany();
  });

  //? Test HTTP requests
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
  });

  describe("POST", () => {
    let token;
    let genreName;
    beforeEach(() => {
      // Initialize a JSON Web token before each test
      token = new User().generateAuthToken();
      // Set the value for the Happy Path
      genreName = "Genre1";
    });

    //? Happy path
    const testRequest = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token) //Include the token in the request
        .send({ name: genreName });
    };

    it("should return 401 if the user is not authorized", async () => {
      //Set an invalid token
      token = "";
      const res = await testRequest();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      genreName = "ab";

      const res = await testRequest();

      expect(res.status).toBe(400);
    });

    it("should save the genre in the database if it is valid", async () => {
      await testRequest();

      //Query the database
      const genre = await Genres.findOne({ name: "Genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return 200 after the genre is stored in the database", async () => {
      //Send the test request
      const res = await testRequest();

      //Assertion
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre1");
    });
  });

  describe("PUT", () => {
    //? First: Declare the required token and value for happy path
    let token;
    let updatedName;
    let testGenre;

    //? Third: Create testRequest for happy path
    const testUpdateRequest = async () => {
      return await request(server)
        .put(`/api/genres/${testGenre._id}`)
        .set("x-auth-token", token)
        .send({ name: updatedName });
    };

    //? Third: Create Before/after each logic
    beforeEach(() => {
      //Initialize The JSON Web token
      token = new User().generateAuthToken();
      //Initialize the object to be updated
      testGenre = {
        _id: new mongoose.Types.ObjectId(),
        name: "Genre 1",
      };
      updatedName = "Updated Genre 1";
    });

    it("should return 401 if the user is not authorized", async () => {
      //Set an invalid token
      token = "";
      const res = await testUpdateRequest();
      expect(res.status).toBe(401);
    });

    it("should return 400 if the genre name is less than 3 characters", async () => {
      updatedName = "ab";
      const res = await testUpdateRequest();
      expect(res.status).toBe(400);
    });

    it("should return 404 if the target email does not exist.", async () => {
      const res = await testUpdateRequest();
      expect(res.status).toBe(404);
    });

    it("should update genre in the database", async () => {
      //Store the genre in the database
      await Genres.collection.insertMany([testGenre]);

      //Test the UPDATE request
      await testUpdateRequest();

      //Test the result
      const res = await Genres.findOne({ _id: testGenre._id });
      expect(res).not.toBeNull();
    });

    it("should return 200 after the genre is updated in the Database", async () => {
      //Store the genre in the database
      await Genres.collection.insertMany([testGenre]);
      //Test the UPDATE request
      const res = await testUpdateRequest();

      //Assertion
      expect(res.status).toBe(200);
    });

    it("should return the updated object", async () => {
      //Store the genre in the database
      await Genres.collection.insertMany([testGenre]);
      const res = await testUpdateRequest();
      expect(res.body).toHaveProperty("_id", testGenre._id.toHexString());
      expect(res.body).toHaveProperty("name", updatedName);
    });
  });

  describe("DELETE", () => {
    //? Declare internal variables
    let token;
    let testGenre;

    //? Build happy path
    const testDeleteRequest = async () => {
      return await request(server)
        .delete(`/api/genres/${testGenre._id}`)
        .set("x-auth-token", token);
    };

    //? Create before each logic
    beforeEach(() => {
      const payload = {
        _id: new mongoose.Types.ObjectId(),
        isAdmin: true,
      };
      //Initialize the JSON web token
      token = new User(payload).generateAuthToken();
      //Initialize the object to be deleted
      testGenre = {
        _id: new mongoose.Types.ObjectId(),
        name: "Genre 1",
      };
    });

    it("should return 401 if the user is not authorized", async () => {
      token = "";
      const res = await testDeleteRequest();
      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      //Store the genre in the databse
      await Genres.collection.insertMany([testGenre]);

      token = new User({
        isAdmin: false,
      }).generateAuthToken();

      const res = await testDeleteRequest();
      expect(res.status).toBe(403);
    });

    it("should return 404 if there is no genre under the provided id", async () => {
      const res = await testDeleteRequest();
      expect(res.status).toBe(404);
    });

    it("should delete the genre from the database and return 200", async () => {
      await Genres.collection.insertMany([testGenre]);
      const res = await testDeleteRequest();
      const genre = await Genres.collection.findOne({
        _id: testGenre._id.toHexString(),
      });
      expect(res.status).toBe(200);
      expect(genre).toBeNull();
    });

    it("should return the deleted genre", async () => {
      await Genres.collection.insertMany([testGenre]);
      const res = await testDeleteRequest();
      expect(res.body).toHaveProperty("_id", testGenre._id.toHexString());
      expect(res.body).toHaveProperty("name", testGenre.name);
    });
  });
});
