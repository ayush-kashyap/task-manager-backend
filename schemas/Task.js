import mongoose, { Schema } from "mongoose";

const task = new Schema({
    "title": {
        type: "String",
        required: true
    },
    "description": {
        type: "String",
        required: true
    },
    "status": {
        type: "String",
        default: "To Do"
    },
    "createdby": {
        type: Schema.Types.ObjectId,
        required: true
    },
    "created_at": {
        type: "String",
        required: true
    },
    "modified_at": {
        type: "String",
    },
    "modified_by": {
        type: Schema.Types.ObjectId,
    },
    "completed_at": {
        type: "String",
    },
    "started_at": {
        type: "String",
    },
    "is_active": {
        type: "Boolean",
        default: true
    },
    "assignees": {
        type: [Schema.Types.ObjectId],
        default: []
    },
    "deadline": {
        type: "String",
        required: true
    },
    "priority":{
        type:"String",
        required:true
    },
    
})

const TaskModel = mongoose.model('task', task)

export { TaskModel };
