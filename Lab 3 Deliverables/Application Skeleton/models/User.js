//User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Schema for the User model.
 * 
 * This schema defines the structure for user documents in the MongoDB database, including various fields
 * like username, password, phone number (ph), and more. Each field is defined with specific data types and validation
 * requirements such as minimum length, requirement status, and uniqueness. Additionally, the schema defines
 * methods for password hashing and comparison to enhance security.
 * 
 * Fields:
 *  - username: A unique username for the user. It must be between 1 and 50 characters long.
 *  - password: The user's password, which will be hashed before saving to the database. It must be at least 8 characters long.
 *  - ph: A unique phone number for the user.
 *  - fullname: The full name of the user.
 *  - gender: The gender of the user. It must be one of 'Male', 'Female', or 'Prefer not to say'.
 *  - nationality: The nationality of the user. Restricted to 'Chinese', 'Indian', or 'Malaysian'.
 *  - profession: The profession of the user.
 *  - homeaddress: The home address of the user.
 *  - homepostal: The postal code of the user's home address.
 *  - securityq: A security question chosen by the user.
 *  - securityans: The answer to the user's security question.
 * 
 * Methods:
 *  - pre('save'): A pre-save hook that automatically hashes the user's password before saving it to the database.
 *  - comparePassword: A method that compares a given password with the user's hashed password in the database.
 */
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Please provide username'],
      minlength: 1,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
    },
    ph: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true
      },
    fullname: {
      type: String,
      required: [true, 'Please provide fullname'],
    },
    gender: {
      type: String,
      required: [true, 'Please provide gender'],
      enum: ['Male', 'Female', 'Prefer not to say']
    },
    nationality: {
      type: String,
      required: [true, 'Please provide nationality'],
      enum: ['Chinese', 'Indian', 'Malaysian']
    },
    profession: {
      type: String,
      required: [true, 'Please provide profession'],
    },
    homeaddress: {
      type: String,
      required: [true, 'Please provide home address'],
    },
    homepostal: {
      type: String,
      required: [true, 'Please provide home postal code'],
    },
    securityq: {
      type: String,
      required: [true, 'Please provide security question'],
    },
    securityans: {
      type: String,
      required: [true, 'Please provide security answer'],
    },
 
  });

UserSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserSchema);