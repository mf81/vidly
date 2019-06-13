const { Movies, validate } = require("../models/moviesModel");
const { Genres } = require("../models/genresModel");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await Movies.find();
  res.send(result);
  res.status(500).send("Something went wrong.");
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Movies.findById({
      _id: req.params.id
    });
    res.send(result);
  } catch (err) {
    res.status("404").send("No ID");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.findById(req.body.genresId);
  if (!genre) return res.status("400").send("No genres");

  let movie = new Movies({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genres: {
      _id: genre._id,
      gen: genre.gen
    }
  });

  try {
    movie = await movie.save();
    res.send(movie);
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
