const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authMiddleware')
const favoriteController = require('../controllers/favoriteController')

router.get('/favorites', auth, favoriteController.getFavorites)
router.post('/favorites', auth, favoriteController.addFavorite)
router.delete('/favorites', auth, favoriteController.removeFavorite)

module.exports = router