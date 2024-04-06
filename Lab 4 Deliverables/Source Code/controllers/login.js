const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Handles user login by verifying username and password.
 * @param {Object} req - The Express request object, containing the `username` and `password` in `req.body`.
 * @param {Object} res - The Express response object used for sending responses to the client.
 */

const login = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({
        msg: "Bad request. Please add both username and password in the request body",
      });
    }
  
    let foundUser = await User.findOne({ username: req.body.username });
    if (foundUser) {
      const isMatch = await foundUser.comparePassword(password);
  
      if (isMatch) {
        return res.status(200).json({ msg: "Successful login"});
      } else {
        return res.status(401).json({ msg: "Invalid username or password" });
      }
    } else {
      return res.status(401).json({ msg: "Invalid username or password" });
    }
  };

  module.exports = login