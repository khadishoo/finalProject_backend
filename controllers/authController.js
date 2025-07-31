const bcrypt = require('bcrypt')
const pool = require('../config/db')
const generateToken = require('../utilits/generateToken') 

class AuthController {
    async register(req, res) {
        const { full_name, username, email, password } = req.body

        if (!full_name || !username || !email || !password) {
            return res.status(400).json({ error: 'Деректер толық емес' })
        }

        try {
            const userByEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email])
            if (userByEmail.rows.length > 0) {
                return res.status(409).json({ error: 'Бұл электронды пошта бұрын қолданылған' })
            }

            const userByUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username])
            if (userByUsername.rows.length > 0) {
                return res.status(409).json({ error: 'Бұл логин бұрын алынған' })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const result = await pool.query(
                'INSERT INTO users (full_name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, full_name, username, email',
                [full_name, username, email, hashedPassword]
            )

            res.status(201).json({
                message: 'Пайдаланушы сәтті тіркелді',
                user: result.rows[0]
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    async login(req, res) {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Деректер толық емес' })
        }

        try {
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
            const user = result.rows[0]

            if (!user) {
                return res.status(404).json({ error: 'Пайдаланушы табылмады' })
            }

            const isMatch = await bcrypt.compare(password, user.password_hash)

            if (!isMatch) {
                return res.status(401).json({ error: 'Құпия сөз немесе пайдаланушы аты қате' })
            }

            const token = generateToken(user) 

            res.status(200).json({
                message: 'Кіру сәтті өтті',
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email
                }
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new AuthController()