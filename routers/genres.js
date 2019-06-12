const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { Genres, validate } = require("../models/genresModel");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genres.find().select({ gen: 1 });
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genres = await Genres.find({ _id: req.params.id }).select({ gen: 1 });
    res.send(genres);
  } catch (err) {
    return res.status("404").send(`No genres ${err}`);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genres = new Genres({
    gen: req.body.gen
  });

  genres = await genres.save();
  res.send(genres);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const update = await Genres.updateOne(
      { _id: req.params.id },
      { gen: req.body.gen },
      { new: true }
    );

    res.send(update);
  } catch (err) {
    return res.status(400).send(`No genres ${err}`);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const del = await Genres.findByIdAndRemove({ _id: req.params.id });
    res.send(del);
  } catch (err) {
    return res.status("404").send(`No genres ${err}`);
  }
});

module.exports = router;
