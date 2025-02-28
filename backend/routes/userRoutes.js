import express from "express";
import {protectRoute} from "../middleware/ProtectRoute.js";
import { getUserProfile, followUnfollowUser, getSuggestedUsers } from "../controllers/userController.js";


const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.get("/suggested", protectRoute, getSuggestedUsers)

export default router 