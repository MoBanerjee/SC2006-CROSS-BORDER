const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Asynchronously retrieves a user's security question based on the phone number provided in the request.
 * @param {Object} req - The Express request object, expected to contain the user's phone number in `req.body.ph`.
 * @param {Object} res - The Express response object used to send back the security question or error messages.
 */

const getq= async (req, res) => {
    try {
      let foundUser = await User.findOne({ ph: req.body.ph });
      if (foundUser) {
        
        return res.status(200).json({ msg:foundUser.securityq});
      } else {
        
        return res.status(404).json({msg: "There is no account registered with this phone number" });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ msg: "An error occurred while processing your request." });
    }
  };

  module.exports = getq