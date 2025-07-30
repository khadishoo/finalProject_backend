const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const auth = require('../middlewares/authMiddleware')
const listingController = require('../controllers/listingController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads'
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueName + ext)
    }
})
const upload = multer({ storage })

router.get('/listings/:id', listingController.getOne)
router.get('/listings', listingController.getlistings) 
router.post('/listings', auth, upload.single('image'), listingController.create)
router.patch('/listings', auth, upload.single('image'), listingController.update)
router.delete('/listings', auth, listingController.remove)

router.get('/favorites', auth, listingController.getFavorites)
router.post('/favorites', auth, listingController.addFavorite)
router.delete('/favorites', auth, listingController.removeFavorite)

module.exports = router
