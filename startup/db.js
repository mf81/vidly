const winston = require("winston");
const mongoose = require("mongoose");

const { loggerWinston } = require("../startup/winston");

module.exports = function() {
  const mongodbUri = "mongodb://localhost/vidly";
  const settings = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoReconnect: true
  };
  mongoose.connect(mongodbUri, settings, function(err, dbref) {
    if (!err) {
      loggerWinston().info("Mongodb connected");
      db = dbref;
    } else {
      loggerWinston().error("Error while connecting to mongoDB" + err);
    }
  });
};
