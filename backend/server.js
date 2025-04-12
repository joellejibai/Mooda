require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const itemsRoutes = require('./routes/items')
const userRoutes = require('./routes/user') // Import the user routes
const uploadRoutes = require('./routes/upload')
const contactRoutes = require('./routes/contact')
const trendRoutes = require('./routes/trends')
const mlRecommendationsRoutes = require('./routes/mlRecommendations')
const savedOutfitRoutes = require('./routes/savedOutfits')

// ✅ Define express app BEFORE using it
const app = express()

// Middleware
app.use(express.json({ limit: '20mb' }))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// ✅ Register routes AFTER defining `app`
app.use('/api/user', userRoutes) // Handle user-related routes
app.use('/api/items', itemsRoutes) // Handle item-related routes
app.use('/api/upload', uploadRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/trends', trendRoutes)
app.use('/api/saved-outfits', savedOutfitRoutes)
app.use('/api/recommendations', mlRecommendationsRoutes)

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
