import jwt from 'jsonwebtoken'
import { UserModel } from '../schemas/User.js';

export const authMiddleware= async (req,res,next)=>{
    var token=req.header("Authorization");
    if(!token){
        return res.status(401).json({msg:"No token available!"})
    }else{
        token=token.replace("Bearer","").trim()
        var isVerified = await jwt.verify(token,process.env.SECRETKEY);
        var userDetail= await UserModel.findOne({email:isVerified.email}).select({password:0});
        req.id=userDetail._id;
        next();
    }
}