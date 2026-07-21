import mongoose, { Schema } from "mongoose";

const user= new Schema({
    "name":{
        type:"String",
        required:true
    },
    "email":{
        type:"String",
        required:true
    },
    "password":{
        type:"String",
        required:false
    },
    "photo_url":{
        type:"String",
        required:false
    },
    "firebaseUid":{
        type:"String",
        required:false
    },
    "fcmToken":{
        type:"String",
        required:false
    }
})

const UserModel=mongoose.model('user',user)

export{UserModel};