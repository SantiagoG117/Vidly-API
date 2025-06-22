//? Third party libraries and models
const request = require("supertest");
const server = require("../../index");
const { Customers } = require("../../models/customersModel");
const { User } = require("../../models/usersModel");

describe("/api/customers", () => {
  //? Suite level: Before and after each logic
  beforeEach(() => {
    // Start up the server
    const server = require("../../index");
  });
  afterEach(async () => {
    // Close the server and clean up test database
    await server.close();
    await Customers.deleteMany();
  });

  //? Post suite:
  describe("POST /", () => {
    //? Testing variables
    let token;
    let name;
    let isGold;
    let phone;
    //? Request level: Before each
    beforeEach(() => {
      //Initialize testing variables
      token = new User().generateAuthToken();
      name = "customer name";
      isGold = true;
      phone = "123456890";
    });
    //? Test request
    const testPostRequest = () => {
      return request(server)
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name, isGold, phone });
    };
    it("should return 400 if name is not provided", async () => {
      name = "";
      const res = await testPostRequest();
      expect(res.status).toBe(400);
    });

    it("should return 400 if isGold is not provided", async () => {
      isGold = null;
      const res = await testPostRequest();
      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is not provided", async () => {
      phone = "";
      const res = await testPostRequest();
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /", () => {
    //? Testing variables
    let token;
    let name;
    let isGold;
    let phone;
    let customer;
    //? Request level: Before each
    beforeEach(async () => {
      //Initialize testing variables
      token = new User().generateAuthToken();
      name = "customer name";
      isGold = true;
      phone = "123456890";
      //Save the customer in the test database
      customer = new Customers({ name, isGold, phone });
      await customer.save();
    });
    //? Test request
    const testPutRequest = () => {
      return request(server)
        .put(`/api/customers/${customer._id}`)
        .set("x-auth-token", token)
        .send({ name, isGold, phone });
    };
    it("should return 400 if name is not provided", async () => {
      name = "";
      const res = await testPutRequest();
      expect(res.status).toBe(400);
    });

    it("should return 400 if isGold is not provided", async () => {
      isGold = null;
      const res = await testPutRequest();
      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is not provided", async () => {
      phone = "";
      const res = await testPutRequest();
      expect(res.status).toBe(400);
    });
  });
});
