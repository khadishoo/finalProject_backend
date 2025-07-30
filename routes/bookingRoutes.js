const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authMiddleware')
const bookingController = require('../controllers/bookingController')

router.post('/bookings', auth, bookingController.createBooking)
router.get('/bookings/me', auth, bookingController.getUserBookings)
router.delete('/bookings/:id', auth, bookingController.cancelBooking)

module.exports = router
