const jwt = require("jsonwebtoken");
const User = require("../models/User");


/**
 * Validates a user's answer to their security question based on the phone number.
 * @param {Object} req - The Express request object, expected to contain the user's phone number and their answer
 *                       to the security question in `req.body.ph` and `req.body.answer`, respectively.
 * @param {Object} res - The Express response object used to send back the verification result or error messages.
 */

const verifyanswer = async (req, res) => {
    try {
      let foundUser = await User.findOne({ ph: req.body.ph });
      if (foundUser) {
        if(req.body.answer===foundUser.securityans)
        return res.status(200).json({ correct:true});
      else
      return res.status(200).json({ correct:false});
      } else {
        
        return res.status(404).json({correct:false, msg: "There is no account registered with this phone number" });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ msg: "An error occurred while processing your request." });
    }
  };

  module.exports = verifyanswer 