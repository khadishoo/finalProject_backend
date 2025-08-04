const pool = require('../config/db')

class BookingController {
  async createBooking(req, res) {
    const { listing_id, check_in, check_out } = req.body

    if (!listing_id || !check_in || !check_out) {
      return res.status(400).json({ error: 'Барлық өрістер толтырылуы тиіс' })
    }

    try {
      const listingCheck = await pool.query(
        'SELECT * FROM listings WHERE id = $1',
        [listing_id]
      )
      if (!listingCheck.rows.length) {
        return res.status(404).json({ error: 'Отель табылмады' })
      }

      const r = await pool.query(
        `INSERT INTO bookings (user_id, listing_id, check_in, check_out)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.user.id, listing_id, check_in, check_out]
      )

      res.status(201).json({ booking: r.rows[0] })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getUserBookings(req, res) {
    try {
      const r = await pool.query(
        `SELECT b.*, l.title, l.image_url, l.price_per_day
         FROM bookings b
         JOIN listings l ON l.id = b.listing_id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [req.user.id]
      )
      res.json({ bookings: r.rows })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async cancelBooking(req, res) {
    const { id } = req.params
    try {
      const r0 = await pool.query('SELECT * FROM bookings WHERE id = $1', [id])
      if (!r0.rows.length) {
        return res.status(404).json({ error: 'Бронь табылмады' })
      }

      const booking = r0.rows[0]
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Сен бұл броньды өшіре алмайсың' })
      }

      await pool.query('DELETE FROM bookings WHERE id = $1', [id])
      res.json({ message: 'Бронь өшірілді' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

module.exports = new BookingController()