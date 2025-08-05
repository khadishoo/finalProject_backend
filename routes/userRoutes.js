const Router = require('express')
const router = new Router()
const userController = require('../controllers/usersController')
const auth = require('../middlewares/authMiddleware')

router.get('/users', userController.getUsers)
router.get('/users/me', auth, userController.getCurrentUser)
router.get('/users/:id', userController.getUserById)
router.get('/users/:id/listings', userController.getUserListings)
// надо доделать =>
router.patch('/users/:id', auth, userController.updateUser)
router.delete('/users/:id', auth, userController.deleteUser)

module.exports = router
