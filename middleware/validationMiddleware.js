const { validatePassword } = require("../models/usersModel");

module.exports = function(req, res, next) {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};
