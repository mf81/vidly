const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const { Users } = require("../models/usersModel");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let users = await Users.findOne({ email: req.body.email });
  if (!users) return res.status(400).send("Log error");

  const validPassword = await bcrypt.compare(req.body.password, users.password);
  if (!validPassword) return res.status(400).send("Log error");

  const token = users.generateAuthToken();

  res.send(token);
});

function validate(value) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(50)
      .required()
  };
  return Joi.validate(value, schema);
}

module.exports = router;
