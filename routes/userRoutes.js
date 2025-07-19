const Router = require('express')
const router = new Router()
const userController = require('../controllers/usersController')
const auth = require('../middlewares/authMiddleware')

// Барлық пайдаланушылар (сұрыптау ?sort=asc|desc)
router.get('/users', userController.getUsers)

// Белгілі бір пайдаланушы
router.get('/users/:id', userController.getUserById)

// Ағымдағы (токеннен)
router.get('/users/me', auth, userController.getCurrentUser)

// Пайдаланушының жариялаған объектілері (листингтер)
router.get('/users/:id/listings', userController.getUserListings)

// Профильді жаңарту (тек иесі)
router.patch('/users/:id', auth, userController.updateUser)

// Аккаунтты өшіру (тек иесі)
router.delete('/users/:id', auth, userController.deleteUser)

module.exports = router
