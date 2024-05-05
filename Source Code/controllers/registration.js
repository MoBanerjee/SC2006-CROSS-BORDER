const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Handles the registration of new users.
 * @param {Object} req - The Express request object containing user details in `req.body`.
 * @param {Object} res - The Express response object used to send back the generated JWT or error messages.
 */

const register = async (req, res) => {
    let { username, password,ph, fullname, gender, nationality, profession, homeaddress, homepostal, securityq, securityans} = req.body;
      if (username.length && password.length) {
        const person = new User({
          username: username,
          password: password,
          ph: ph,
          fullname:fullname,
          gender:gender,
          nationality:nationality,
          profession:profession,
          homeaddress:homeaddress,
          homepostal:homepostal,
          securityq:securityq,
          securityans:securityans
        });
        await person.save();
        let foundUser = await User.findOne({ username: req.body.username });
        const token = jwt.sign(
          { id: foundUser._id, username: foundUser.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        return res.status(201).json({ token });
      } else {
        return res.status(400).json({ msg: "Please add all values in the request body" });
      }
    
  };

  module.exports = register