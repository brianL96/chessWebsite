const rateLimit = require('express-rate-limit');

console.log("Inside the rate limiter file");

const routeLimiter = rateLimit({

    windowMs: 60 * 1000,
    max: () => { 
        //console.log("Rate Limiter Used");
        return 250
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: 'You have exceeded the current rate limit of 250 requests per minute',
    

});

module.exports = {
    routeLimiter
};

