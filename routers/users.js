const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const validation = require("../middleware/userValidationMiddleware");
const password = require("../middleware/passwordHashingMiddleware");
const _ = require("lodash");
const { Users } = require("../models/usersModel");
const express = require("express");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const users = await Users.find().select("-password");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await Users.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", [validation, password], async (req, res) => {
  let users = await Users.findOne({ email: req.body.email });
  if (users) return res.status(400).send("E-mail exist ...");

  users = new Users(req.body);
  try {
    const token = users.generateAuthToken();
    users = await users.save();
    users = _.pick(users, ["_id", "name", "email"]);

    res.header("x-auth-token", token).send(users);
  } catch (err) {
    if (err) return res.status(400).send(` No user to add... ${err}`);
  }
});

router.put("/:id", [auth, admin, validation, password], async (req, res) => {
  try {
    const user = await Users.updateOne({ _id: req.params.id }, req.body, {
      new: true
    });
    res.send(user);
  } catch (err) {
    return res.status(400).send(`No user to change ... ${err}`);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const del = await Users.findByIdAndRemove({
      _id: req.params.id
    }).select("-password");
    res.send(del);
  } catch (err) {
    return res.status("404").send(`No user for DELETE - bad ID ${err}`);
  }
});

module.exports = router;
