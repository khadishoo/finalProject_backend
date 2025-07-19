const router = require('express').Router()
const listingController = require('../controllers/listingController')
const auth = require('../middlewares/authMiddleware')

router.get('/listings', listingController.list)
router.get('/listings/:id', listingController.getOne)
router.post('/listings', auth, listingController.create)
router.patch('/listings/:id', auth, listingController.update)
router.delete('/listings/:id', auth, listingController.remove)

module.exports = router
