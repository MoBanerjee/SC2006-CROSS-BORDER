//Avatar.js
const mongoose = require('mongoose');

/**
 * Schema definition for the Avatar model.
 * 
 * This schema defines the structure of the documents within the Avatar collection in MongoDB, tailored for
 * storing information about user avatars. Each avatar document includes metadata about the uploaded file
 * (such as the file's original name, its MIME type, and encoding), as well as the URL where the avatar can be accessed.
 * 
 * Fields:
 *  - fieldname: The field name specified in the form upload.
 *  - originalname: The original name of the file on the user's computer.
 *  - encoding: The type of encoding of the file.
 *  - mimetype: The MIME type of the file, which indicates the nature and format of the file.
 *  - url: The URL where the uploaded avatar image can be accessed. This is used to store the location of the image after it's been uploaded to a storage service (AWS S3).
 *  - userId: A reference to the ID of the user to whom the avatar belongs. This can be used to associate the avatar with a specific user in the application.
 *  - key: A unique identifier for the file in the storage system. This is used with cloud storage services where the key uniquely identifies the file within a bucket.
 * The Avatar model is used to interact with the avatars collection in MongoDB, allowing for CRUD operations on avatar documents.
 */
const avatarschema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    url: String, // Store the URL of the image
    userId: String,
    key:String
});

module.exports = mongoose.model("Avatar", avatarschema);
