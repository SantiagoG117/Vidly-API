/* 
? We can only access the request body through unit tests.
*/

//? External models and third party libraries
const { User } = require("../../../../models/usersModel");
const authorization = require("../../../../middleware/authorization");
const mongoose = require("mongoose");

//? Import the file to be tested
describe("authentication middleware", () => {
  it("should populate req.user with the payload of a valid JSON Web token", () => {
    //Create an user
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    //Create a token
    const token = new User(user).generateAuthToken();

    // Mock the request, response and next
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    //Call the authorization function
    authorization(req, res, next);
    console.log(req.user);
    console.log(user);

    //Assertion:
    expect(req.user).toMatchObject(user);
  });
});
