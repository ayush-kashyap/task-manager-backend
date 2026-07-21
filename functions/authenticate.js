import jwt from 'jsonwebtoken'
import { UserModel } from '../schemas/User.js';

export const authMiddleware = async (req, res, next) => {
    var token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ msg: "No token available!" })
    } else {
        token = token.replace("Bearer", "").trim()
        try {
            var isVerified = jwt.verify(token, process.env.SECRETKEY);
        } catch (e) {
            isVerified = null
        }

        if (isVerified) {
            var userDetail = await UserModel.findById(isVerified?.id).select({ password: 0 });
            if (userDetail) {
                req.id = userDetail._id;
            } else {
                return res.status(401).json({ detail: "Invalid User!" })
            }
        } else {
            return res.status(401).json({ detail: "Invalid Token!" })
        }
        next();
    }
}