const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using Mongoose.

 * @param {string} url - The MongoDB URI string used to establish a database connection.
 * @returns {Promise} A promise that resolves to the Mongoose connection object upon successful connection,
 *                    or rejects with an error if the connection cannot be established.
 */
const connectDB = (url) => {
  return mongoose.connect(url, {});
};

module.exports = connectDB;