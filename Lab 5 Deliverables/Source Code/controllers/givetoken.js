const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generates and returns a JSON Web Token (JWT) for a user based on their username.
 * @param {Object} req - The Express request object, expected to contain the user's username in `req.body.username`.
 * @param {Object} res - The Express response object used to send back the generated JWT and authentication message.
 */

const giveToken = async (req, res) => {
  
    let foundUser = await User.findOne({ username: req.body.username });
        const token = jwt.sign(
          { id: foundUser._id, username: foundUser.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
  
        return res.status(200).json({ msg: "Authentication successful", token });
  };

  module.exports = giveToken