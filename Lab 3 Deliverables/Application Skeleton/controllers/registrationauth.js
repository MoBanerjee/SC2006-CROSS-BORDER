const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Performs preliminary authentication checks for new user registration.
 * @param {Object} req - The Express request object, expected to contain `username`, `password`, and `confirmPassword`.
 * @param {Object} res - The Express response object used for sending back the results of the authentication checks.
 */
const regauth = async (req, res) => {
    let foundUser = await User.findOne({ username: req.body.username });
    if (foundUser === null) {
      let { username, password,confirmPassword } = req.body;
      if (password.length < 3) {
        return res.status(422).json({ msg: "Password does not meet the strength requirements." }); 
      }
      if(password!=confirmPassword){
        return res.status(400).json({ msg: "Password and confirm password do not match." }); 
      }
      return res.status(200).json({ msg: ""});
    } else {
      return res.status(409).json({ msg: "Username already in use. Please choose a different one" });
    }
  }

  module.exports = regauth