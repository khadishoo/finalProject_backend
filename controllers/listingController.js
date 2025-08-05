const pool = require('../config/db')

class ListingController {
    async create(req, res) {
        const { title, description, price_per_day } = req.body

        if (!title || !description || !price_per_day || !req.file) {
            return res.status(400).json({ error: 'Барлық өрістер толтырылуы тиіс' })
        }

        const image_url = `/uploads/${req.file.filename}`

        try {
            const r = await pool.query(
                `INSERT INTO listings (user_id, title, description, price_per_day, image_url)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [req.user.id, title, description, price_per_day, image_url]
            )
            res.status(201).json({ listing: r.rows[0] })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async getlistings(req, res) {
        try {
            const r = await pool.query(`SELECT * FROM listings`)
            if (!r.rows.length) return res.status(404).json({ error: 'Отель табылмады' })
            res.json({ listing: r.rows })
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
            if (!r.rows.length) return res.status(404).json({ error: 'Отель табылмады' })
            res.json({ listing: r.rows[0] })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async update(req, res) {
        const { id, title, description, price_per_day } = req.body

        if (!id || !title || !description || !price_per_day) {
            return res.status(400).json({ error: 'Барлық өрістер міндетті' })
        }

        const image_url = req.file ? `/uploads/${req.file.filename}` : null

        try {
            const r0 = await pool.query('SELECT id, user_id FROM listings WHERE id = $1', [id])
            if (!r0.rows.length) return res.status(404).json({ error: 'Отель табылмады' })

            const listing = r0.rows[0]
            if (listing.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Рұқсат жоқ' })
            }

            const r = await pool.query(
                `UPDATE listings SET
                 title = $1,
                 description = $2,
                 price_per_day = $3,
                 image_url = COALESCE($4, image_url)
                 WHERE id = $5
                 RETURNING *`,
                [title, description, price_per_day, image_url, id]
            )

            res.json({ listing: r.rows[0] })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    async remove(req, res) {
        const { id } = req.body
        try {
            const r0 = await pool.query('SELECT id, user_id FROM listings WHERE id = $1', [id])
            if (!r0.rows.length) return res.status(404).json({ error: 'Отель табылмады' })

            const listing = r0.rows[0]
            if (listing.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Рұқсат жоқ' })
            }

            await pool.query('DELETE FROM listings WHERE id = $1', [id])
            res.json({ message: 'Отель өшірілді' })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}

module.exports = new ListingController()