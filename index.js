const express = require("express");
const helmet = require("helmet");
require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
app.use(express.json());

require("./startup/db")(app);
require("./startup/routes")(app);
require("./startup/jwt")(app);
const loggerWinston = require("./startup/winston");

app.use(helmet());
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  loggerWinston().info(`Słucham na porcie: ${port}`);
});

module.exports = server;
