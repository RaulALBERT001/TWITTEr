import express from "express";
import {protectRoute} from "../middleware/ProtectRoute.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)


export default router 