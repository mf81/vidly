const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  isAdmin: Boolean
});

usersSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

function validate(value) {
  const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
  };
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: new PasswordComplexity(complexityOptions),
    isAdmin: Joi.boolean().required()
    // password: Joi.string()
    //   .min(8)
    //   .max(50)
    //   .required()
  };
  return Joi.validate(value, schema);
}

const Users = mongoose.model("Users", usersSchema);

exports.Users = Users;
exports.usersSchema = usersSchema;
exports.validate = validate;
