const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function() {
  console.log("jestem w bazie");
  // mongoose.connect(
  //   "mongodb://localhost/vidly",
  //   {
  //     useNewUrlParser: true,
  //     useFindAndModify: false,
  //     useCreateIndex: true
  //   },
  //   (err, res) => {
  //     if (err) return winston.info("Connected to DB");
  //     winston.info("Connected to DB");
  //     console.log("Connected to DB");
  //   }
  // );

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
