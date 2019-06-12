const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Users, validate } = require("../models/usersModel");
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

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let users = await Users.findOne({ email: req.body.email });
  if (users) return res.status(400).send("E-mail exist ...");

  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(password, salt);

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

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);

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

//   const response = await Promise.all([
//     axios.get("/some_url_endpoint"),
//     axios.get("/some_url_endpoint")
//   ]);

// function resolveAfter2Seconds() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve('resolved');
//     }, 2000);
//   });
// }

// async function passwordHash(reqBody) {
//   return new Promise(resolve => {
//     const { password } = reqBody;
//     const salt = bcrypt.genSalt(10);
//     const res = bcrypt.hash(password, salt);
//     resolve(res);
//   });
// }
