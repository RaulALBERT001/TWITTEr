import express from 'express'
import connectMongoDB from '../db/ConnectMongoDB.js'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// when we hit /api/auth/signup  the res.json will be called

app.use("/api/auth",authRoutes )

console.log(process.env.MONGO_URI)

app.listen(PORT,  () => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB()
})