const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Validates the uniqueness of a phone number during user registration.
 * @param {Object} req - The Express request object, expected to contain the user's phone number in `req.body.ph`.
 * @param {Object} res - The Express response object used for sending responses to the client, indicating the
 *                       status of the phone number check.
 */

const phoneauth = async (req, res) => {
    try {
      let foundUser = await User.findOne({ ph: req.body.ph });
      if (foundUser) {
        return res.status(409).json({ msg: "This phone number is already linked to an existing account. Please sign in." });
      } else {
        return res.status(200).json({ msg: "Phone number unique, proceed with registration." });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ msg: "An error occurred while processing your request." });
    }
  };

  module.exports = phoneauth