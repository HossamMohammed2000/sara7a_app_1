import { createClient } from "redis"; 
import { REDIS_URI } from "../../config/config.service.js";
import e from "cors";


export const redisClient = createClient({
    url: REDIS_URI
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis is connected successfully");
    } catch (error) {
        console.log("Error connecting to redis", error);
    }
};