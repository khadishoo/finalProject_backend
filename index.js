const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const requestLimit = require('./middlewares/requestLimit')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const listingRoutes = require('./routes/listingRoutes')


require('dotenv').config()
const app = express()

app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(helmet())
app.use(express.json())

const PORT = process.env.PORT || 3002

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', listingRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})