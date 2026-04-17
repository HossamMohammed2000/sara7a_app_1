// ipRequest
const ipRequest = {};
// set
const blockedIps = new Set();


// map
const unBlockedTimers = new Map();

const RATE_LIMIT = 5;
 const WINDOW_MS = 60 * 1000; 

 export const customRateLimiter = (req, res, next) => {
 const Ip = req.ip;
  const currentTime = Date.now();
  if(blockedIps.has(ip)){
    return res.status(403).json({ message: "Blocked Ip . Try again later." });
  }
  if(!ipRequest[ip]){
    ipRequest[ip] = {
        count: 1,
        startTime: currentTime
    };
    return next();
  }
  const diff = currentTime - ipRequest[ip].startTime;
  if(diff < WINDOW_MS){
    ipRequest[ip].count ++
    if(ipRequest[ip].count > RATE_LIMIT){
        blockedIps.add(ip);
      if(!unBlockedTimers.has(ip)){
        const timer = setTimeout(() => {
            blockedIps.delete(ip);
            unBlockedTimers.delete(ip);
        }, WINDOW_MS);    
        unBlockedTimers.set(ip, timer);
      }
      return res.status(429).json({ message: "Too many requests . you have been blocked." });
    }

  }
    else{
        ipRequest[ip] = {
            count: 1,
            startTime: currentTime
        };
    }
    return next();
}
