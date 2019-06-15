//const error = require("./middleware/errorMiddleware");
const loggerWinston = require("../startup/winston");
const config = require("config");

module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    loggerWinston().error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  } else {
    loggerWinston().info("jwtPrivateKey is OK");
  }
};
