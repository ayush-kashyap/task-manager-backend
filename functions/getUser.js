import { Router } from "express";
import jwt from "jsonwebtoken"
import { UserModel } from "../schemas/User.js";
import { authMiddleware } from "./authenticate.js";

const router = Router()

const getUserData = async (req, res) => {
    try {
        const details = await UserModel.findById(req?.id).select({ password: 0 })
        res.status(200).json({ detail: "success", details })
    } catch (error) {
        res.status(501).json({
            "success": false,
            "detail": "Internal Server Error",
            "error": error
        })
    }
}

const saveFcmToken = async (req, res) => {
    const { fcmToken } = req.body;
    if (!fcmToken) {
        return res.status(400).json({ success: false, msg: "Missing fcmToken" });
    }

    try {
        if (!req.id) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }
        await UserModel.updateOne({ _id: req.id }, { $set: { fcmToken } });
        res.status(200).json({ success: true, msg: "FCM token saved successfully" });
    } catch (error) {
        console.error("Save FCM Token Error:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error", error: error.message });
    }
}

router.get("/user", authMiddleware, getUserData)
router.post("/save-fcm-token", authMiddleware, saveFcmToken)
export { router as getUser }