const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Updates the profile details of an authenticated user.
 * @param {Object} req - The Express request object, containing the user's updated profile information and their userId.
 * @param {Object} res - The Express response object used to send back the updated profile information or error messages.
 */

const updateProfile = async (req, res) => {
    
    const userId = req.userId;
    const { fullname, gender, nationality, profession, homeaddress, homepostal, securityq, securityans } = req.body;
  
    if (!fullname || !gender || !nationality || !profession || !homeaddress || !homepostal || !securityq || !securityans) {
      return res.status(400).json({ msg: "Please add all required values in the request body" });
    }
  console.log(securityans);
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        fullname,
        gender,
        nationality,
        profession,
        homeaddress,
        homepostal,
        securityq,
        securityans
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  };

  module.exports = updateProfile