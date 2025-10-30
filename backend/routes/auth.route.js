import express from "express"
import { signin, signout, signup, getProfile, updateProfile } from "../controller/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
import { upload } from "../utils/uploadHandler.js"

const router = express.Router()

router.post("/signup", upload.single("profilePhoto"), signup)
router.post("/signin", signin)
router.get("/signout", verifyToken, signout)
router.get("/profile", verifyToken, getProfile)
router.put("/profile", verifyToken, upload.single("profilePhoto"), updateProfile)

export default router
