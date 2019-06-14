const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

module.exports = function(req, res, next) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

function validate(value) {
  const complexityOptions = {
    min: 10,
    max: 255,
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
