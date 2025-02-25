import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user_id,  res) => {
    const token = jwt.sign({user_id}, process.env.JWT_SECRET, {expiresIn: "1d"})

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "development" ? false : true,  
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    })
}



