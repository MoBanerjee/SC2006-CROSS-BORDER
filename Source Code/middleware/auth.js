//auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware for authenticating JSON Web Tokens (JWT) to protect routes in an Express application.
 * @param {Object} req - The Express request object. The middleware reads the Authorization header from this object.
 * @param {Object} res - The Express response object. Used to send responses if authentication fails.
 * @param {Function} next - The next middleware function in the stack. Called to pass control to the next middleware when authentication succeeds.
 */
const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("nonsense")
    return res.status(401).json({msg: "Unauthorized. Please add valid token"});
  }

  const token = authHeader.split(' ')[1].replace(/^"|"$/g, '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    req.user = { id, username }
    next()
  } catch (error) {
    console.log("nonsense more probab")
    return res.status(401).json({msg: "Unauthorized. Please add valid token"});
  }
}

module.exports = authenticationMiddleware