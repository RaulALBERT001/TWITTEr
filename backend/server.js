import express from 'express'
import connectMongoDB from '../db/ConnectMongoDB.js'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// when we hit /api/auth/signup  the res.json will be called
app.use(express.json())//to parse req.body
app.use(express.urlencoded({extended: true}))//to parse form data(urlencoded)
app.use(cookieParser())//to parse req.cookies

app.use("/api/auth",authRoutes )
app.use("/api/user", userRoutes)




console.log(process.env.MONGO_URI)

app.listen(PORT,  () => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB()
})
