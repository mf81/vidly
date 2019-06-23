const express = require("express");
const router = express.Router();
const { Rentals } = require("../models/rentalsModel");
const { Movies } = require("../models/moviesModel");
const auth = require("../middleware/authMiddleware");
const moment = require("moment");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerId is not provided");
  if (!req.body.movieId) return res.status(400).send("movieId is not provided");

  const rental = await Rentals.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  });
  if (!rental) return res.status(404).send("Rentl not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already possed.");

  rental.dateReturned = new Date();
  rental.rentalFee =
    moment().diff(rental.dateOut, "days") * rental.movie.dailyRentalRate;
  await rental.save();

  await Movies.update(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  return res.send(rental);
});

module.exports = router;
