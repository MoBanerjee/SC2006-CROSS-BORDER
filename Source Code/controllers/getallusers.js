const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Asynchronous route handler to fetch and return all users from the database.
 * @param {Object} req - The Express request object. Not used in this function but necessary for route handler signature.
 * @param {Object} res - The Express response object used to send the HTTP response.
 */

const getAllUsers = async (req, res) => {
    let users = await User.find({});
  
    return res.status(200).json({ users });
  };

  module.exports = getAllUsers