const Router = require('express')
const router = new Router()
const authController = require('../controllers/authController')
const auth = require('../middlewares/authMiddleware')
const requestLimit = require('../middlewares/requestLimit')

router.post('/register', authController.register)
router.post('/login', requestLimit , authController.login)

module.exports = router