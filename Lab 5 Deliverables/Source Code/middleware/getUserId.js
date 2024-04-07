//getUserId.js
const jwt = require('jsonwebtoken');

/**
 * Middleware for extracting the user ID from a JSON Web Token (JWT) and attaching it to the request object.
 * @param {Object} req - The Express request object. The middleware reads the Authorization header from this object to extract the JWT.
 * @param {Object} res - The Express response object. Used to send responses if the token validation fails.
 * @param {Function} next - The next middleware function in the stack. Called to continue processing the request once authentication is successful.
 */
async function extractUserId(req, res, next) {
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(' ')[1].replace(/^"|"$/g, '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; 
    next();
  } catch (error) {
    console.log("what the hell");
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = extractUserId