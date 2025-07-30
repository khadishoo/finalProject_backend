const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const requestLimit = require('./middlewares/requestLimit')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const listingRoutes = require('./routes/listingRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
require('dotenv').config()

const app = express()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
const PORT = process.env.PORT || 3002

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(helmet())
app.use(express.json())


app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', listingRoutes)
app.use('/api', bookingRoutes)

app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
