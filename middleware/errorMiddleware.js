const loggerWinston = require("../startup/winston");

module.exports = function(err, req, res, next) {
  loggerWinston().error(err.message);

  res.status(500).send(`Something failed.: ${err.message}`);
  next();
};
