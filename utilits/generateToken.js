const jwt = require('jsonwebtoken')

function generateToken(user) {
    if (!user || !user.id) {
        throw new Error('Пайдаланушы ID табылмады, токен жасау мүмкін емес')
    }

    return jwt.sign(
        { 
            id: user.id,                   
            username: user.username || '',
        }, 
        process.env.JSON_SECRET, 
        { 
            expiresIn: '1h' 
        }
    )
}

module.exports = generateToken
