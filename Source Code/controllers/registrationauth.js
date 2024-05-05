const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Performs preliminary authentication checks for new user registration.
 * @param {Object} req - The Express request object, expected to contain `username`, `password`, and `confirmPassword`.
 * @param {Object} res - The Express response object used for sending back the results of the authentication checks.
 */

const regauth= async (req, res) => {
    let foundUser = await User.findOne({ username: req.body.username });
    if (foundUser === null) {
      let { username, password,confirmPassword } = req.body;
      if (password.length < 3) {
        return res.status(422).json({ msg: "Password does not meet the strength requirements." }); 
      }
      if(password!=confirmPassword){
        return res.status(400).json({ msg: "Password and confirm password do not match." }); 
      }
      return res.status(200).json({ msg: ""});
    } else {
      return res.status(409).json({ msg: "Username already in use. Please choose a different one" });
    }
  }

  /**
 * Evaluates the strength of a given password and returns a score along with a corresponding strength level.
 * 
 * The strength evaluation is based on various criteria, including the diversity of characters used
 * in the password and the presence of different character types (uppercase, lowercase, digits, and special characters).
 * Each unique character contributes to the score up to five times, encouraging the use of varied characters.
 * Additional points are awarded for the inclusion of digits, uppercase letters, lowercase letters, and non-word
 * characters, promoting a mix of different character types for a stronger password.
 * 
 * The function categorizes the password strength into four levels based on the calculated score:
 * - None: For an empty password or undefined input.
 * - Very Weak: For scores less than 30.
 * - Weak: For scores between 30 and 60.
 * - Good: For scores between 61 and 80.
 * - Strong: For scores above 80.
 * 
 * @param {string} password - The password string to be evaluated.
 * @returns {Object} An object containing the `score` and `level` of the password's strength.
 *                   `score` is a numerical value representing the password's strength,
 *                   and `level` is a string indicating the strength category ('None', 'Very Weak', 'Weak', 'Good', 'Strong').
 */

  const evaluatePasswordStrength = (password) => {
    let score = 0;

    if (!password) {
        return { score: 0, level: "None" };
    }

    // Award every unique letter until 5 repetitions
    let letters = new Object();
    for (let i=0; i<password.length; i++) {
        letters[password[i]] = (letters[password[i]] || 0) + 1;
        score += 5.0 / letters[password[i]];
    }

    // Bonus points for mixing it up
    var variations = {
        digits: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        nonWords: /\W/.test(password),
    }

    let variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    if(score > 80) return { score, level: "Strong" };
    if(score > 60) return { score, level: "Good" };
    if(score >= 30) return { score, level: "Weak" };

    return { score, level: "Very Weak" };
};

module.exports = {regauth,evaluatePasswordStrength};