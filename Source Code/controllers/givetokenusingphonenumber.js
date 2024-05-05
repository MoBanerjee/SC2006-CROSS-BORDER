const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authenticates a user by their phone number and generates a JSON Web Token (JWT) for them.
 * @param {Object} req - The Express request object, expected to contain the user's phone number in `req.body.ph`.
 * @param {Object} res - The Express response object used to send back the JWT and authentication success message.
 */

const giveTokenUsingPh = async (req, res) => {
  
    let foundUser = await User.findOne({ ph: req.body.ph });
        const token = jwt.sign(
          { id: foundUser._id, username: foundUser.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
  
        return res.status(200).json({ msg: "Authentication successful", token });
  };

  module.exports = giveTokenUsingPh