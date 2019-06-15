const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    exitOnError: false,
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "all.log" }),
      new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
        level: "error"
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: "exceptions.log" })
    ]
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple()
      })
    );
  }
  return logger;
};
