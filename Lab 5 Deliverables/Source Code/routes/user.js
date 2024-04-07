//user.js
const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer.js')
const authMiddleware = require('../middleware/auth')
const {userProfile,clearUserProfileCache}=require("../controllers/userprofile.js");
const login=require("../controllers/login");
const changeph=require("../controllers/changephonenumber");
const forgotpasswordphauth=require("../controllers/forgotpasswordphoneauth");
const getAllUsers=require("../controllers/getallusers")
const getq=require("../controllers/getquestion.js");
const giveToken=require("../controllers/givetoken.js")
const giveTokenUsingPh=require("../controllers/givetokenusingphonenumber.js")
const loginphauth=require("../controllers/loginphoneauth.js")
const phoneauth=require("../controllers/phoneauth.js")
const register=require("../controllers/registration.js")
const {regauth}=require("../controllers/registrationauth.js")
const updateProfile=require("../controllers/updateprofile.js")
const verifyanswer=require("../controllers/verifyanswer.js")
const verifypassword=require("../controllers/verifypassword.js")
const getUserId=require("../middleware/getUserId.js");
const Avatar = require('../models/Avatar');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION 
});

const s3 = new AWS.S3();

// Route definitions
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/regauth").post(regauth);
router.route("/phoneauth").post(phoneauth);
router.route("/users").get(getAllUsers);
router.route("/loginphauth").post(loginphauth);
router.route("/getq").post(getq);
router.route("/verifyanswer").post(verifyanswer);
router.route("/forgotpasswordphauth").post(forgotpasswordphauth);
router.route("/giveToken").post(giveToken);
router.route("/giveTokenUsingPh").post(giveTokenUsingPh);
router.get('/profile', getUserId, userProfile, (req, res) => {
    res.json(req.userProfile);
  });
router.route("/verifypassword").post(verifypassword);
router.post('/clear-cache', getUserId, authMiddleware,clearUserProfileCache);
router.post('/changeph', getUserId, authMiddleware,changeph);
router.patch('/update', getUserId,authMiddleware, updateProfile);


/**
 * POST route for file upload. It uses the 'multer' middleware for handling multipart/form-data.
 * This route handles the uploading of a user avatar to AWS S3, including deletion of a previous avatar if it exists,
 * and updating the Avatar model in MongoDB with the new avatar's details.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const userId = req.body.userId; 
  try {
    
    const existingAvatar = await Avatar.findOne({ userId: userId });
    if (existingAvatar) {
     
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: existingAvatar.key, 
      };
      await s3.deleteObject(deleteParams).promise();

     
      await Avatar.deleteOne({ userId: userId });
    }

    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `avatars/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const uploadResult = await s3.upload(params).promise();

    
    const newAvatar = await Avatar.create({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      url: uploadResult.Location,
      userId: userId,
      key: params.Key, 
    });

    res.status(201).send(newAvatar);
  } catch (e) {
    console.error("Error handling the image upload:", e);
    res.status(500).json({ error: true, message: e.toString() });
  }
});

/**
 * POST route for retrieving a user's avatar.
 * This route fetches the URL of a user's avatar from the MongoDB database and returns it.
 */
router.post('/avatar',async (req, res) => {
  const userId = req.body.userId; 
  if (!userId) {
    return res.status(400).json({ error: true, message: "User ID is missing." });
  }

  try {
    const avatar = await Avatar.findOne({ userId: userId });

    if (!avatar) {
      return res.status(404).json({ error: true, message: "Avatar not found." });
    }

   
    res.status(200).json({ url: avatar.url });
  } catch (e) {
    console.error("Error fetching avatar:", e);
    res.status(500).json({ error: true, message: "An error occurred while fetching the avatar." });
  }
});

/**
 * POST route for updating a user's password.
 * It includes validation for the presence of userId and newPassword, checks that the new password is not the same as the old password,
 * hashes the new password, and updates the user document in MongoDB.
 */
router.post('/update-password', async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: 'userId and newPassword are required' });
  }

  try {
   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(newPassword);

    if (isMatch) {
      return res.status(200).json({ message: "New Password should not be same as old password!"});
    } 
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    console.log("mess");
    res.status(500).json({ message: 'An error occurred while updating the password' });
  }
});

/**
 * DELETE route for deleting a user's avatar.
 * This route handles deletion of the user's avatar from both AWS S3 and the MongoDB database.
 */
router.delete('/delpic', async (req, res) => {
  const userId = req.body.userId; 
  if (!userId) {
    return res.status(400).json({ error: true, message: "User ID is missing." });
  }

  try {

    const existingAvatar = await Avatar.findOne({ userId: userId });
    if (!existingAvatar) {
      return res.status(404).json({ error: true, message: "Avatar not found." });
    }

    
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: existingAvatar.key, 
    };
    await s3.deleteObject(deleteParams).promise();

   
    await Avatar.deleteOne({ userId: userId });

    res.status(204).send(); 
  } catch (e) {
    console.error("Error deleting the avatar:", e);
    res.status(500).json({ error: true, message: e.toString() });
  }
});

module.exports = router;