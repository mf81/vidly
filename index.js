require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/errorMiddleware");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genres = require("./routers/genres");
const customers = require("./routers/customers");
const movies = require("./routers/movies");
const rentals = require("./routers/rental");
const users = require("./routers/users");
const auth = require("./routers/auth");
const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
const app = express();

// process.on("uncaughtException", ex => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });
// process.on("unhandledRejection", ex => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", ex => {
  throw ex;
});

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/vidly",
  level: "error"
});

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
} else {
  console.log("jwtPrivateKey is OK");
}

app.use(helmet());
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

mongoose.connect(
  "mongodb://localhost/vidly",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  (err, res) => {
    if (err) throw err;
    console.log("Połączono z bazą");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Słucham na porcie: ${port}`);
});
