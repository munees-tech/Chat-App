import express from "express";
import { login, logout, signup , updateProfile ,chackAuth} from "../controlers/auth.controler.js";
import { protectRoute } from "../middleware/auth.middlewere.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout)
router.put("/update-profile", protectRoute,updateProfile)
router.get("/chack", protectRoute,chackAuth)

export default router;