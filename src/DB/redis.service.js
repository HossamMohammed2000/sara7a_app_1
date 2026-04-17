import e from "cors";
import { redisClient } from "./redis.connection.js";

export const revokeTokenKeyPrefix = async ({User_Id}) => {
  return `User:revoked_tokens:${User_Id}`;
};

export const revokeTokenKey=({User_Id , jti})=>{
  return `${revokeTokenKeyPrefix({User_Id})}:${jti}`;
}

// set a key-value pair in redis
export const set = async (key, value, ttl = null) => {
  try {
    const data = typeof value != "string" ? JSON.stringify(value) : value;
    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: "EX", value: ttl },
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.log("Error value in redis", error);
  }
};

// get a value by key from redis
export const get = async (key, value, ttl = null) => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    console.log("Error getting value from redis", error);
  }
};


// update a value by key in redis
export const update = async (key) => {
  try {   
 const isExist = await redisClient.exists(key);
    if (!isExist)
         return false ;
        const data = typeof value != "string" ? JSON.stringify(value) : value;
    

    if (ttl) {
      return await redisClient.set(key, value, {
        expiration: { type: "EX", value: ttl },
      });
    } else {
      return await redisClient.set(key, value);
    }
    
  } catch (error) {
    console.log("Error updating value in redis", error);

    }   
};
// delete a key-value pair from redis
export const del = async (key) => {
  try {
    const isExist= await redisClient.exists(key);
    if (!isExist)
         return false ;
    return await redisClient.del(key);
    } catch (error) {
    console.log("Error deleting value from redis", error);
  }
};

// expire 
export const expire = async (key, ttl) => {
  try {
    const isExist= await redisClient.exists(key);
    if (!isExist)
         return false ;
    return await redisClient.expire(key, ttl);
    } catch (error) {
    console.log("Error expiring value in redis", error);
  } 
};
// ttl
export const ttl = async (key) => {
  try {
    const isExist= await redisClient.exists(key);
    if (!isExist)
         return false ;
    return await redisClient.ttl(key);
    } catch (error) {
    console.log("Error getting ttl from redis", error);

  }
};

// keys pattern
export const keys = async (pattern) => {
    try {
        return await redisClient.keys(pattern);
    } catch (error) {
        console.log("Error getting keys from redis", error);
    }
}

// 