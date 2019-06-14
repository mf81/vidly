require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(express.json());

require("./startup/db")(app);
require("./startup/jwt")(app);
require("./startup/routes")(app);
require("./startup/winston")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Słucham na porcie: ${port}`);
});
