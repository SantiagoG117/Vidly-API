//? Import the file to be tested
const { User } = require("../../../models/usersModel");

//? Import external libraries:
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
require("../../../startup/logging"); //ignores Winston logs in our testing

//Test Suite: Container for multiple tests
describe("userModel.generateAuthToken", () => {
  it("Should return a valid JSON Web Token", () => {
    //Create the user
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);

    //Get the token and decoded to get its payload
    const token = user.generateAuthToken();
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"));

    //Assertions
    expect(decodedPayload).toMatchObject(payload);
  });
});
