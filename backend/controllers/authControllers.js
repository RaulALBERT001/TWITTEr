import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { generateTokenAndSetCookie } from "../lib/generateTokens.js";

export const signup = async(req, res) => {
 try {
    const {username,FullName,email,age,password} = req.body;

    const minAge = 18;
    if (age < minAge) {
        return res.status(400).json({
            message: "You must be at least 18 years old"
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        })
    }

    const existingUser = await  User.findOne({username})
    if (existingUser) {
        return res.status(400).json({
            message: "Username already taken",
        })
    } 
    const existingEmail = await  User.findOne({email})
    if (existingEmail) {
        return res.status(400).json({
            message: "emial already used by another account ):",
        })
    } 

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters",
        })
    }

    //hash password
    const salt =  await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(password, salt )

    const newUser = new User({
        FullName,
        username,
        email,
        password: hashedPassword,
        age,
    })

    if(newUser){
        generateTokenAndSetCookie(newUser._id,res)
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            FullName: newUser.FullName,
            username: newUser.username,
            email: newUser.email,
            age: newUser.age,

        })
    }

 } catch (error) {
    res.status(500).json({
        message:`internal server error ${error.message}`
    })
 }
    
}
export const login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const passwordIsCorrect = await bcrypt.compare(password, user?.password || "")
        
        if(!user || !passwordIsCorrect){
            return res.status(400).json({
                message: "credentials incorrect"
            })
        }

        generateTokenAndSetCookie(user._id,res)
        res.status(200).json({
            _id: user._id,
            FullName: user.FullName,
            username: user.username,
            email: user.email,
            age: user.age,
        })

    } catch (error) {
        res.status(500).json({
            message:`  ${error.message}`
        })
    }
 }
 export const logout= async(req, res) => {
   try {
     res.clearCookie("jwt");
     res.status(200).json({ message: "logged out successfully" });
   } catch (error) {
    res.status(500).json({
        message:`  ${error.message}`
    })
   }
 }

 export const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")// it does not exist in req.body, thats why we use the protectRoute middleware
        if (!user) {
            return res.status(404).json({
                message: "User not found :|"
            })
        }

        res.status(200).json({user})

    } catch (error) {
        
        console.log("error in getUser controller", error.message)
        res.status(500).json({
            message:`  ${error.message}`
        })

    }
 }