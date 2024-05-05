const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Verifies a user's password against the stored hash in the database.
 * @param {Object} req - The Express request object, containing the `userId` and `password` in the body.
 * @param {Object} res - The Express response object used for sending responses to the client.
 */

const verifypassword=async(req,res)=>{
    const {userId, password}= req.body;
    console.log(userId);
    let foundUser = await User.findOne({ _id: userId });
    if (foundUser) {
      const isMatch = await foundUser.comparePassword(password);
  
      if (isMatch) {
        return res.status(200).json({ msg: "Password verified successfully!"});
      } else {
        return res.status(401).json({ msg: "Password incorrect! Please try again." });
      }
    } else {
      return res.status(401).json({ msg: "No such user" });
    }
  }

  module.exports = verifypassword