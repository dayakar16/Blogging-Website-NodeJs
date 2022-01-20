const rateLimit = require("express-rate-limit");


exports.loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    handler :(req,res,next)=>{
        let err = new Error('Too Many requests, try back later!');
        err.status = 429;
        return next(err);
    }
  });

