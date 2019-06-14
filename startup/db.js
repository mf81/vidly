const winston = require("winston");
const mongoose = require("mongoose");

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
      console.log("Mongodb connected");
      db = dbref;
    } else {
      console.log("Error while connecting to mongoDB" + err);
    }
  });
};
