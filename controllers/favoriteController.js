const pool = require('../config/db')

class FavoriteController {
  async addFavorite(req, res) {
    const { listing_id } = req.body
    try {
      await pool.query(
        'INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.user.id, listing_id]
      )
      res.json({ message: 'Избранға қосылды' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async removeFavorite(req, res) {
    const { listing_id } = req.body
    try {
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2',
        [req.user.id, listing_id]
      )
      res.json({ message: 'Избраннан өшірілді' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getFavorites(req, res) {
    try {
      const result = await pool.query(
        `SELECT l.*
         FROM favorites f
         JOIN listings l ON l.id = f.listing_id
         WHERE f.user_id = $1`,
        [req.user.id]
      )
      res.json({ listings: result.rows })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

module.exports = new FavoriteController()
