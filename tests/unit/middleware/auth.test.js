const { Users } = require("../../../models/usersModel");
const auth = require("../../../middleware/authMiddleware");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("populate req.user witch the payload of valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = new Users(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toBeDefined();
  });
});
