const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Asynchronous function to retrieve a user's phone number based on their username.
 * @param {Object} req - The Express request object, containing the `username` in `req.body.username`.
 * @param {Object} res - The Express response object used for sending the phone number or error messages back to the client.
 */

const loginphauth = async (req, res) => {
    try {
     
      let foundUser = await User.findOne({ username: req.body.username });
      if (foundUser) {
        
        return res.status(200).json({ ph: foundUser.ph, msg: "User found. Returning associated phone number." });
      } else {
        
        return res.status(404).json({ msg: "No user found with that username." });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ msg: "An error occurred while processing your request." });
    }
  };


  module.exports = loginphauth