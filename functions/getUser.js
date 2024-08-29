import { Router } from "express";
import jwt from "jsonwebtoken"
import { UserModel } from "../schemas/User.js";

const router = Router()

const getUserData = async (req, res) => {
    var token = req.header('Authorization')
    token = token.replace("Bearer", "").trim()
    try {
        var isVerified = await jwt.verify(token, process.env.SECRETKEY)
        if (isVerified) {
            const details = await UserModel.findOne({ email: isVerified.email }).select({password:0})
            res.status(200).send({ msg: "success", details })
        } else {
            res.status(401).send()
        }
    } catch (error) {
        res.status(501).send()
    }
}

router.get("/user", getUserData)
export { router as getUser }