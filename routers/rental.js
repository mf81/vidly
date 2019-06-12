const { Rentals, validate } = require("../models/rentalsModel");
const { Movies } = require("../models/moviesModel");
const { Customers } = require("../models/customerModel");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const result = await Movies.find().sort("-dateOut");
  res.send(result);
});

// router.get("/:id", async (req, res) => {
//   try {
//     const result = await Movies.findById({
//       _id: req.params.id
//     });
//     res.send(result);
//   } catch (err) {
//     res.status("404").send("Ni chuja nie ma");
//   }
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customers.findById(req.body.customerId);
  if (!customer) return res.status("400").send("No customer");

  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status("400").send("No movie");

  if (movie.numberInStock === 0) return res.status("400").send("No movie");

  let rental = new Rentals({
    customer: {
      _id: customer._id,
      name: customer.name,
      phome: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // rental = await rental.save();
  // movie.numberInStock--;
  // movie.save();

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (err) {
    return res.status("404").send(`Err: ${err}`);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.findById(req.body.genresId);
  if (!genre) return res.status("400").send("No genres");

  try {
    const result = await Movies.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genres: {
          _id: genre._id,
          gen: genre.gen
        }
      }
    );

    res.send(result);
  } catch (err) {
    return res.status("400").send(`No ID ${err}`);
  }
});

//findOneAndUpdate({ age: 17 }, { $set: { name: "Naomi" } }, { new: true }, function(err, doc) {

router.delete("/:id", async (req, res) => {
  try {
    const result = await Movies.findOneAndDelete({ _id: req.params.id });
    res.send(result);
  } catch (err) {
    return res.status("400").send(`No ID ${err}`);
  }
});

module.exports = router;
