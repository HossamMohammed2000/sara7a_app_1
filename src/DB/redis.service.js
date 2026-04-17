import { redisClient } from "./redis.connection.js";

// ================= TOKEN KEYS =================
export const revokeTokenKeyPrefix = ({ User_Id }) => {
  return `User:revoked_tokens:${User_Id}`;
};

export const revokeTokenKey = ({ User_Id, jti }) => {
  return `${revokeTokenKeyPrefix({ User_Id })}:${jti}`;
};

// ================= SET =================
export const set = async (key, value, ttl = null) => {
  try {
    const data = typeof value !== "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        EX: ttl, 
      });
    }

    return await redisClient.set(key, data);
  } catch (error) {
    console.log(" Error setting value in redis", error);
  }
};

// ================= GET =================
export const get = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    console.log(" Error getting value from redis", error);
  }
};

// ================= UPDATE =================
export const update = async (key, value, ttl = null) => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) return false;

    const data = typeof value !== "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        EX: ttl,
      });
    }

    return await redisClient.set(key, data);
  } catch (error) {
    console.log(" Error updating value in redis", error);
  }
};

// ================= DELETE =================
export const del = async (key) => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) return false;

    return await redisClient.del(key);
  } catch (error) {
    console.log(" Error deleting value from redis", error);
  }
};

// ================= EXPIRE =================
export const expire = async (key, ttl) => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) return false;

    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.log(" Error expiring value in redis", error);
  }
};

// ================= TTL =================
export const ttl = async (key) => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) return false;

    return await redisClient.ttl(key);
  } catch (error) {
    console.log("❌ Error getting ttl from redis", error);
  }
};

// ================= KEYS =================
export const keys = async (pattern) => {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.log("Error getting keys from redis", error);
  }
};