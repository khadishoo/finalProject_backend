const rateLimit = require('express-rate-limit')

const requestLimit = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: 'Көп сұрау жасалды, кейінірек қайталаңыз',
    statusCode: 429
})

module.exports = requestLimit