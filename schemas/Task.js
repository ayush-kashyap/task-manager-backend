import mongoose, { Schema } from "mongoose";

const task= new Schema({
    "title":{
        type:"String",
        required:true
    },
    "description":{
        type:"String",
        required:true
    },
    "status":{
        type:"String",
        default:"To Do"
    },
    "createdby":{
        type:"String",
        required:true
    }
})

const TaskModel=mongoose.model('task',task)

export{TaskModel};