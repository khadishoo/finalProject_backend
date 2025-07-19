const pool = require('../config/db')

class UserController {
    async getUsers(req, res) {
        const { sort = 'asc' } = req.query
        const direction = sort && sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
        try {
            const result = await pool.query(
                `SELECT id, full_name, username, email, created_at
                 FROM users
                 ORDER BY username ${direction}`
            )
            res.status(200).json({ users: result.rows })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    async getUserById(req, res) {
        const { id } = req.params
        if (!id) return res.status(400).json({ error: 'ID берілмеді' })
        try {
            const result = await pool.query(
                `SELECT id, full_name, username, email, created_at
                 FROM users
                 WHERE id = $1`,
                [id]
            )
            if (!result.rows.length) {
                return res.status(404).json({ error: 'Пайдаланушы табылмады' })
            }
            res.status(200).json({ user: result.rows[0] })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    async getCurrentUser(req, res) {
        try {
            const r = await pool.query(
                `SELECT id, full_name, username, email, created_at
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            )
            if (!r.rows.length) return res.status(404).json({ error: 'Пайдаланушы табылмады' })
            res.status(200).json({ user: r.rows[0] })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    async updateUser(req, res) {
        const { id } = req.params
        const { full_name, email, username } = req.body
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ error: 'Рұқсат жоқ' })
        }
        try {
            if (email) {
                const byEmail = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, id])
                if (byEmail.rows.length) return res.status(409).json({ error: 'Email қолданылған' })
            }
            if (username) {
                const byUsername = await pool.query('SELECT id FROM users WHERE username = $1 AND id <> $2', [username, id])
                if (byUsername.rows.length) return res.status(409).json({ error: 'Логин алынған' })
            }
            const r = await pool.query(
                `UPDATE users SET
                 full_name = COALESCE($1, full_name),
                 email = COALESCE($2, email),
                 username = COALESCE($3, username)
                 WHERE id = $4
                 RETURNING id, full_name, username, email, created_at`,
                [full_name || null, email || null, username || null, id]
            )
            res.status(200).json({ user: r.rows[0] })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ error: 'Рұқсат жоқ' })
        }
        try {
            const r = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id])
            if (!r.rows.length) return res.status(404).json({ error: 'Пайдаланушы табылмады' })
            res.status(200).json({ message: 'Аккаунт өшірілді' })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    async getUserListings(req, res) {
        const { id } = req.params
        try {
            const listings = await pool.query(
                `SELECT id, user_id, type, title, city, price_per_day, created_at
                 FROM listings
                 WHERE user_id = $1
                 ORDER BY created_at DESC`,
                [id]
            )
            res.status(200).json({ listings: listings.rows })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }
}

module.exports = new UserController()
