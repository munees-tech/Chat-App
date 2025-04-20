import express from "express";
import { protectRoute } from "../middleware/auth.middlewere.js";
import { getAllUsers , getMessage , sendMessage} from "../controlers/message.controler.js";
const router = express.Router()

router.get("/users", protectRoute ,getAllUsers);
router.get("/:id", protectRoute ,getMessage);
router.post("/send/:id", protectRoute ,sendMessage)

export default router;