const { Users } = require("../../../models/usersModel");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("usersModel.generateAuthToken", () => {
  it("return valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new Users(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
