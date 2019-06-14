const bcrypt = require("bcrypt");

module.exports = async function(req, res, next) {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
    next();
  } catch (ex) {
    res.status(400).send(`Invalid password creater: ${ex}`);
  }
};
