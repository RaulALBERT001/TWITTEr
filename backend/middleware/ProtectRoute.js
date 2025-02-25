import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        const token =  req.cookies.jwt
        console.log(`TOKEN: ${token}`)
        if (!token) {
            return res.status(401).json({ message: "unauthorized user or no token provided" })
        }

        const decoded = jwt.verify(token,  process.env.JWT_SECRET)
        console.log(`DECODED: ${decoded}`)
        if (!decoded) {
            return res.status(401).json({ message: "user token is not valid " })
        }


        const user = await User.findById(decoded.user_id).select ("-password")
        console.log(`USER: ${user}`)
        if (!user) {
            return res.status(404).json({error: "user wasn't found :|"})

        }
        req.user = user
        next()//used to call the next function, wich in this case is the controller executed after this middleware
    } catch (error) {
        console.log( "Error in protectRoute middleware",  error.message)
        return res.status(501).json({error: error.message})
    }
}