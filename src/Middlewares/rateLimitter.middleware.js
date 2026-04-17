import { get, set } from "../DB/redis.service.js";

const RATE_LIMIT = 5;
const WINDOW_MS = 60; 

/* ================= RATE LIMITER ================= */
export const customRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

   
    const isBlocked = await get(`blocked:${ip}`);
    if (isBlocked) {
      return res.status(403).json({
        message: "Blocked Ip. Try again later.",
      });
    }

   
    let requestData = await get(`rate_limit:${ip}`);

    if (!requestData) {
     
      await set(
        `rate_limit:${ip}`,
        { count: 1 },
        WINDOW_MS
      );
      return next();
    }

    requestData = JSON.parse(requestData);

    requestData.count++;

   
    if (requestData.count > RATE_LIMIT) {
      // block ip
      await set(`blocked:${ip}`, true, WINDOW_MS);

      return res.status(429).json({
        message: "Too many requests. You have been blocked.",
      });
    }

   
    await set(
      `rate_limit:${ip}`,
      requestData,
      WINDOW_MS
    );

    return next();
  } catch (error) {
    console.log("RateLimiter Error:", error);
    return next();
  }
};