
//? Import models and third party libraries
const request = require("supertest");
const { User } = require("../../models/usersModel");
const { Genres } = require("../../models/genresModel");

//? Create test suite
describe("authorization", () => {
  let server;
  let token;
  //? Open and close the server after each test
  beforeEach(() => {
    server = require("../../index");
    //Initialize JSON Web token
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    //Clean up function
    await Genres.deleteMany();
    server.close();
  });

  //? Build Happy Path to an endpoint that requires authorization
  const testRequest = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "Genre1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await testRequest();
    expect(res.status).toBe(401);
  });

  it("should return 200 if the provided token is valid", async () => {
    const res = await testRequest();
    expect(res.status).toBe(200);
  });
});
