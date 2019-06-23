const genres = require("../routers/genres");
const customers = require("../routers/customers");
const movies = require("../routers/movies");
const rentals = require("../routers/rental");
const users = require("../routers/users");
const auth = require("../routers/auth");
const returns = require("../routers/returns");
const error = require("../middleware/errorMiddleware");

module.exports = function(app) {
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};
