const mongoose = require("mongoose");
const Joi = require("joi");

const customersSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 12
  }
});

function validate(value) {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string()
      .required()
      .min(2)
      .max(50),
    phone: Joi.string()
      .required()
      .min(5)
      .max(12)
  };
  return Joi.validate(value, schema);
}

const Customers = mongoose.model("Customers", customersSchema);

exports.Customers = Customers;
exports.validate = validate;
exports.customersSchema = customersSchema;
