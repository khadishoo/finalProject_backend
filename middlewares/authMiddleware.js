const jwt = require('jsonwebtoken')
require('dotenv').config()

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Токен дұрыс емес немесе жоқ!' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JSON_SECRET)

        if (!decoded.id) {
            return res.status(403).json({ error: 'Қате токен: пайдаланушы ID табылмады' })
        }

        req.user = decoded
        next()
    } catch (e) {
        return res.status(403).json({ error: 'Қате токен: ' + e.message })
    }
}

module.exports = authMiddleware
