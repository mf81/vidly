const Joi = require("joi");
const mongoose = require("mongoose");
const { genresSchema } = require("./genresModel");

const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  numberInStock: {
    type: Number,
    required: true,
    default: 0
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    default: 0
  },
  genres: {
    type: genresSchema,
    required: true
  }
});

function validate(value) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(50)
      .required(),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(99)
      .required(),
    dailyRentalRate: Joi.number()
      .integer()
      .min(0)
      .max(99)
      .required(),
    genresId: Joi.objectId().required()
    // genres: Joi.object().keys({
    //   gen: Joi.string()
    //     .min(3)
    //     .max(50)
    //     .required()
    // })
  };
  return Joi.validate(value, schema);
}

const Movies = mongoose.model("Movies", moviesSchema);

exports.moviesSchema = moviesSchema;
exports.validate = validate;
exports.Movies = Movies;
