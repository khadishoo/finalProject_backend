const pool = require('../config/db')

class ListingController {
    async create(req, res) {
        const { type, title, city, address, description, price_per_day, image_url } = req.body
        if (!type || !title || !city || !price_per_day) {
            return res.status(400).json({ error: 'Деректер толық емес' })
        }
        try {
            const r = await pool.query(
                `INSERT INTO listings (user_id, type, title, city, address, description, price_per_day, image_url)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                 RETURNING *`,
                [req.user.id, type, title, city, address || null, description || null, price_per_day, image_url || null]
            )
            res.status(201).json({ listing: r.rows[0] })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async list(req, res) {
        const { city, type, q } = req.query
        const cond = []
        const vals = []
        let i = 1
        if (city) { cond.push(`LOWER(city)=LOWER($${i++})`); vals.push(city) }
        if (type) { cond.push(`LOWER(type)=LOWER($${i++})`); vals.push(type) }
        if (q) { cond.push(`(LOWER(title) LIKE LOWER($${i}) OR LOWER(description) LIKE LOWER($${i}))`); vals.push(`%${q}%`); i++ }
        const where = cond.length ? 'WHERE ' + cond.join(' AND ') : ''
        try {
            const r = await pool.query(
                `SELECT l.*, u.username
                 FROM listings l
                 JOIN users u ON u.id = l.user_id
                 ${where}
                 ORDER BY l.created_at DESC`,
                vals
            )
            res.json({ listings: r.rows })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async getOne(req, res) {
        const { id } = req.params
        try {
            const r = await pool.query(
                `SELECT l.*, u.username, u.full_name
                 FROM listings l
                 JOIN users u ON u.id = l.user_id
                 WHERE l.id = $1`,
                [id]
            )
            if (!r.rows.length) return res.status(404).json({ error: 'Табылмады' })
            res.json({ listing: r.rows[0] })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { type, title, city, address, description, price_per_day, image_url } = req.body
        try {
            const owner = await pool.query('SELECT user_id FROM listings WHERE id = $1', [id])
            if (!owner.rows.length) return res.status(404).json({ error: 'Табылмады' })
            if (owner.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Рұқсат жоқ' })
            const r = await pool.query(
                `UPDATE listings SET
                 type = COALESCE($1,type),
                 title = COALESCE($2,title),
                 city = COALESCE($3,city),
                 address = COALESCE($4,address),
                 description = COALESCE($5,description),
                 price_per_day = COALESCE($6,price_per_day),
                 image_url = COALESCE($7,image_url)
                 WHERE id = $8
                 RETURNING *`,
                [type, title, city, address, description, price_per_day, image_url, id]
            )
            res.json({ listing: r.rows[0] })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async remove(req, res) {
        const { id } = req.params
        try {
            const owner = await pool.query('SELECT user_id FROM listings WHERE id = $1', [id])
            if (!owner.rows.length) return res.status(404).json({ error: 'Табылмады' })
            if (owner.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Рұқсат жоқ' })
            await pool.query('DELETE FROM listings WHERE id = $1', [id])
            res.json({ message: 'Өшірілді' })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}

module.exports = new ListingController()
