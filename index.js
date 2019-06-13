require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/errorMiddleware");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(express.json());
app.use(helmet());

require("./startup/db")(app);
require("./startup/routes")(app);

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

//winston.add(winston.transports.File, { filename: "logfile.log" });
//winston.add(
//   new winston.transports.MongoDB({
//     db: "mongodb://localhost/vidly",
//     level: "error"
//   })
// );
winston.add(
  new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
);

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
} else {
  console.log("jwtPrivateKey is OK");
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Słucham na porcie: ${port}`);
});
