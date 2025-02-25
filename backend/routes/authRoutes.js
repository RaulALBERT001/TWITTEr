import express from "express";
import {login, logout, signup, getUser} from  "../controllers/authControllers.js"
import {protectRoute} from "../middleware/ProtectRoute.js"
const router = express.Router();


router.get("/getUser",protectRoute,  getUser)
router.post("/signup", signup)    
router.post("/login", login)

router.post("/logout", logout)

export default router
