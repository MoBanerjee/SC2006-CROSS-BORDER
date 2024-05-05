const { createClient } = require('redis');
const User = require('../models/User');

const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

/**
 * Middleware to retrieve a user's profile data.
 * 
 * First, attempts to retrieve the user's profile from Redis cache using a unique cache key. If the profile
 * is found in the cache, it is immediately returned, significantly reducing latency by avoiding a database query.
 * 
 * If the profile is not in the cache, the function queries MongoDB for the user's data, caches it in Redis for
 * future requests, and then proceeds to the next middleware with the data.
 * 
 * @param {Object} req - The Express request object, containing the userId.
 * @param {Object} res - The Express response object.
 * @param {Function} next - Callback to the next middleware function.
 */
async function userProfile(req, res, next) {
  const userId = req.userId; 
  const cacheKey = `userProfile:${userId}`;

  try {
   
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      let userProfile;
      try {
        userProfile = JSON.parse(cachedData);
      } catch (parseError) {
        console.error('Error parsing user profile from cache', parseError);
        
      }

      if (userProfile) {
        req.userProfile = userProfile;
        console.log("frm cache");
        return next();
      }
    }

   
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).send('User not found');
    }

   
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(userProfile));
    console.log("frm mongo");
    req.userProfile = userProfile;
    next();
  } catch (error) {
    console.error('Error accessing Redis or MongoDB', error);
    next(error);
  }
}

/**
 * Clears a user's profile from the Redis cache.
 * @param {Object} req - The Express request object, containing the userId.
 */
async function clearUserProfileCache(req) {
  const userId = req.userId;
  const cacheKey = `userProfile:${userId}`;

  try {
    
    const result = await redisClient.del(cacheKey);
    if (result === 1) {
      console.log(`Cache for user ${userId} cleared successfully.`);
    } else {
      console.log(`No cache found for user ${userId} to clear.`);
    }
  } catch (error) {
    console.error(`Error clearing cache for user ${userId}`, error);
    throw error; 
  }
}



module.exports = {userProfile,clearUserProfileCache};
