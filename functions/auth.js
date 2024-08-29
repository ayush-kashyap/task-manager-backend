import { Router } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserModel } from "../schemas/User.js";

const router = Router()


const userSignup = async (req, res) => {
    const data = req.body
    if (data.name != ""&&data.password != "" && data.email != "") {
        try{
            var user = await UserModel.findOne({ email: data.email })
            if (user) {
                res.status(409).send()
            } else {
                var salt = await bcrypt.genSalt(10)
                var pass = await bcrypt.hash(data.password, salt)
                data.password = pass
                await UserModel.create(data)
                res.status(201).send({success: true, msg: "User created succesfully" })
            }
        } catch (error) {
            res.status(500).send()
        }
    }
    else {
        res.status(404).send()
    }
}
const UserLogin = async (req, res) => {
    const data = req.body
    if (data.password != "" && data.email != "") {
        const user = await UserModel.findOne({ email: data.email })
        if (user !== null) {
            var matched = await bcrypt.compare(data.password, user.password)
            if (matched) {
                var token = jwt.sign({
                    id: user._id.toString(),
                    email: user.email,
                    isAdmin: false
                }, process.env.SECRETKEY)
                res.status(200).send({ success: true, msg: "Logged in", token })
            }else
            res.status(401).send()
        } else {
            res.status(404).send()
        }
    } else {
        res.status(404).send()
    }
}


router.post("/usersignup", userSignup)
router.post("/userlogin", UserLogin)

export { router as auth }