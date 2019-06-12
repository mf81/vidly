const Joi = require("joi");
const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
  gen: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

function validate(value) {
  const schema = {
    gen: Joi.string()
      .min(3)
      .max(50)
      .required()
  };
  return Joi.validate(value, schema);
}

const Genres = mongoose.model("Genres", genresSchema);

exports.Genres = Genres;
exports.genresSchema = genresSchema;
exports.validate = validate;
