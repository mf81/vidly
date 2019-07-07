const express = require("express");
const helmet = require("helmet");
require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");

const app = express();
app.use(express.json());

require("./startup/db")();
require("./startup/routes")(app);
require("./startup/jwt")();
require("./startup/prod")(app);
const loggerWinston = require("./startup/winston");

const PORT = config.get("PORT");

const port = process.env.PORT || PORT || 3000;
const server = app.listen(port, () => {
  loggerWinston().info(`Słucham na porcie: ${port}`);
});

module.exports = server;
