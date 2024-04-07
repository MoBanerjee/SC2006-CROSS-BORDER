const jwt = require("jsonwebtoken");
const User = require("../models/User");
/**
 * Middleware to authenticate a user's phone number during a forgot password process.
 * @param {Object} req - The Express request object, expected to contain the user's phone number in `req.body.ph`.
 * @param {Object} res - The Express response object used to send back the verification result.
 */

const forgotpasswordphauth = async (req, res) => {
    try {
      let foundUser = await User.findOne({ ph: req.body.ph });
      if (foundUser) {
        
        return res.status(200).json({ valid: true,msg: "User found. Phone number valid." });
      } else {
        
        return res.status(404).json({valid:false, msg: "There is no account registered with this phone number" });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ valid: false, msg: "An error occurred while processing your request." });
    }
  };

  module.exports = forgotpasswordphauth