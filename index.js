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
require("./startup/winston")(app);

app.use(helmet());
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Słucham na porcie: ${port}`);
});
