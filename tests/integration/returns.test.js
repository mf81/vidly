//POST /api/returns {customerId, movieId}

//return 401 if client is not logged in
//return 400 if customerId is not providet
//return 400 if movieId is not providet
//return 404 if rental not found fo this customer/movie
//return 400 if rental already processed

//return 200 if valid requast
//set the return date
//calculate the rental fee
//increase the stock
//return the rental

const request = require("supertest");

const { Movies } = require("../../models/moviesModel");
const { Rentals } = require("../../models/rentalsModel");
const { Users } = require("../../models/usersModel");
const mongoose = require("mongoose");
const moment = require("moment");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movies;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({
        customerId,
        movieId
      });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new Users().generateAuthToken();

    movies = new Movies({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genres: { gen: "12345" },
      numberInStock: 10
    });
    await movies.save();

    rental = new Rentals({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345"
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rentals.deleteMany();
    await Movies.deleteMany();
    await server.close();
  });

  it("return 401 if client is not login", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("return 400 if customerId is not providet", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 400 if movieId is not providet", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 404 if rental not found fo this customer/movie", async () => {
    await Rentals.deleteMany();
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("return 400 if rental already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 200 if valid requast", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("set the return date", async () => {
    const res = await exec();

    const rentalInDb = await Rentals.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  it("calculate the rental fee", async () => {
    rental.dateOut = moment()
      .add(-7, "days")
      .toDate();
    await rental.save();

    const res = await exec();
    const rentalInDb = await Rentals.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("increase the stock", async () => {
    const res = await exec();
    const movieInDb = await Movies.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movies.numberInStock + 1);
  });

  it("return the rental", async () => {
    const res = await exec();
    const rentalInDb = await Rentals.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie"
      ])
    );
  });
});
