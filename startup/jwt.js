//const error = require("./middleware/errorMiddleware");
const config = require("config");

module.exports = function() {
  console.log("jwt");
  if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  } else {
    console.log("jwtPrivateKey is OK");
  }
};
