const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Asynchronously updates the phone number of a user in the database.
 * @param {Object} req - The Express request object. Contains the user's `userId` and the new phone number in `req.body.ph`.
 * @param {Object} res - The Express response object. Not used in the current implementation but can be used to send responses.
 */

const changeph=async(req,res)=>{
    try{
      const userId = req.userId;
  
      await User.findByIdAndUpdate(userId, { ph: req.body.ph }, { new: true });
    }catch(error){
      console.log(error);
    }
  }

  module.exports = changeph