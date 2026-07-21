import { Router } from "express"
import { TaskModel } from "../schemas/Task.js"
import { authMiddleware } from "./authenticate.js"
import moment from "moment"
const router = Router()

const createTask = async (req, res) => {
    var data = req.body
    data.createdby = req.id
    if (data.title != "") {
        data.created_at = moment().format()
        try {
            await TaskModel.create(data)
            res.status(201).send({ msg: "Succesfully created!" })
        } catch (error) {
            res.status(500).send({detail:error})
        }
    } else {
        res.status(404).send()
    }
}
const updateTaskStatus = async (req, res) => {
    const data = req.body
    if (data._id != "") {
        
       
        try {
            var fetchedTask = await TaskModel.findOne({ _id: data._id });
            
            if (fetchedTask.createdby.equals(req.id) || fetchedTask?.assignees?.some(assignee => assignee.equals(req.id))) {
                fetchedTask.status=data.status;
                fetchedTask.modified_at = moment().format();
                fetchedTask.modified_by = req.id;
                if (fetchedTask.status == "Done") {
                    fetchedTask.completed_at = moment().format();
                }
                else if (fetchedTask.status == "In Progress") {
                    fetchedTask.started_at = moment().format();
                }
                await fetchedTask.save();
                res.status(200).send({ detail: "Succesfully updated!" })
            } else {
                res.status(401).send({ detail: "Invalid task" })
            }

        } catch (error) {
            res.status(501).send()
        }
    } else {
        res.status(404).send()
    }
}
const updateTask = async (req, res) => {
    const data = req.body
    if (data._id != "") {
        data.modified_at = moment().format();
        data.modified_by = req.id;
        if (data.status == "Done") {
            data.completed_at = moment().format();
        }
        else if (data.status == "In Progress") {
            data.started_at = moment().format();
        }
        try {
            var fetchedTask = await TaskModel.findOne({ _id: data._id });
            
            if (fetchedTask.createdby.equals(req.id) || fetchedTask?.assignees?.some(assignee => assignee.equals(req.id))) {
                fetchedTask.title=data.title;
                fetchedTask.description=data.description;
                fetchedTask.status=data.status;
                fetchedTask.assignees=data.assignees;
                fetchedTask.modified_at = moment().format();
                fetchedTask.modified_by = req.id;
                await fetchedTask.save();
                res.status(200).send({ detail: "Succesfully updated!" })
            } else {
                res.status(401).send({ detail: "Invalid task" })
            }
            
        } catch (error) {
            res.status(501).send({detail:"Some error occured while updating task"})
        }
    } else {
        res.status(404).send({detail:"No task found to update"})
    }
}
const deleteTask = async (req, res) => {
    const data = req.params
    if (data != "") {
        try {
            var taskToBeUpdated=await TaskModel.findOne({ _id: data.id });
            if(taskToBeUpdated){
                taskToBeUpdated.is_active=false;
                await taskToBeUpdated.save();
                res.status(204).send({ msg: "Succesfully deleted!" })
            }else{
res.status(404).send({ msg: "Invalid Task" })
            }
            
        } catch (error) {
            res.status(501).send()
        }
    } else {
        res.status(404).send()
    }
}
const readTask = async (req, res) => {
    const data = req
    if (data != "") {
        try {
            var tasks = await TaskModel.aggregate([
                {
                    $match: {
                        createdby: data.id ? data.id: "",
                        is_active: !(data?.body?.is_deleted || false)
                    }
                },
                
                {
                    $lookup: {
                        from: "users",
                        localField: "createdby",
                        foreignField: "_id",
                        pipeline: [
        {
          $project: {
            password: 0,
            firebaseUid: 0,
            _v: 0,
          }
        }
      ],
                        as: "createdby_data"
                    }
                },
                {
                    $unwind: {
                        path: "$createdby_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "assignees",
                        foreignField: "_id",
                        as: "assignees_data",
                        pipeline: [
        {
          $project: {
            password: 0,
            firebaseUid: 0,
            _v: 0,
          }
        }
      ],
                    }
                }
            ])
            if (tasks.length > 0) {
                res.status(200).send({ tasks })
            } else {
                res.status(404).send({ detail: "No tasks found" })
            }
        } catch (error) {
            res.status(501).send()
        }
    } else {
        res.status(404).send()
    }
}
const readSingleTask = async (req, res) => {
    const data = req
    if (data != "") {
        try {
            var tasks = await TaskModel.findOne({ _id: data?.params?.id, is_active: !(data?.body?.is_deleted || false) })
            if (tasks) {
                res.status(200).send({ tasks })
            } else {
                res.status(404).send({ detail: "Task not found" })
            }

        } catch (error) {
            res.status(501).send()
        }
    } else {
        res.status(404).send()
    }
}


router.post('/create', authMiddleware, createTask)
router.get('/read', authMiddleware, readTask)
router.get('/readsingle/:id', authMiddleware, readSingleTask)
router.delete('/delete/:id', authMiddleware, deleteTask)
router.put("/update", authMiddleware, updateTask)
router.put("/updatestatus", authMiddleware, updateTaskStatus)

export { router as taskFunc }