const mongoose = require("mongoose");
const loggerWinston = require("../startup/winston");
const config = require("config");

module.exports = function() {
  const db = config.get("db");
  const settings = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoReconnect: true
  };
  mongoose.connect(db, settings, function(err, dbref) {
    if (!err) {
      loggerWinston().info(`Mongodb connected to: ${db}`);
    } else {
      loggerWinston().error(`Error while connecting to ${db} mongoDB ${err}`);
    }
  });
};
