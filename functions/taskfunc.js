import { Router } from "express"
import { TaskModel } from "../schemas/Task.js"
import  {authMiddleware}  from "./authenticate.js"
const router = Router()

const createTask = async (req, res) => {
    var data = req.body
    data.createdby=req.id
    if (data.title != "") {
        try {
            await TaskModel.create(data)
            res.status(201).send({ msg: "Succesfully created!" })
        } catch (error) {
            res.status(500).send()
        }
    }else{
        res.status(404).send()
    }
}
const updateTask = async (req, res) => {
    const data = req.body
    if (data._id != "") {
        try {
            await TaskModel.updateOne({_id:data._id},{$set:{status:data.status}})
            res.status(201).send({ msg: "Succesfully updated!" })
        } catch (error) {
            res.status(501).send()
        }
    }else{
        res.status(404).send()
    }
}
const deleteTask = async (req, res) => {
    const data = req.params.id
    if (data!= "") {
        try {
            await TaskModel.deleteOne({_id:data})
            res.status(204).send({ msg: "Succesfully deleted!" })
        } catch (error) {
            res.status(501).send()
        }
    }else{
        res.status(404).send()
    }
}
const readTask = async (req, res) => {
    const data = req.id
    if (data != "") {
        try {
            var tasks=await TaskModel.find({createdby:data})
            res.status(200).send({tasks})
        } catch (error) {
            res.status(501).send()
        }
    }else{
        res.status(404).send()
    }
}
const readSingleTask = async (req, res) => {
    const data = req.params.id
    if (data != "") {
        try {
            var tasks=await TaskModel.findOne({_id:data})
            res.status(200).send({tasks})
        } catch (error) {
            res.status(501).send()
        }
    }else{
        res.status(404).send()
    }
}


router.post('/create',authMiddleware,createTask)
router.get('/read',authMiddleware,readTask)
router.get('/readsingle/:id',authMiddleware,readSingleTask)
router.delete('/delete/:id',authMiddleware,deleteTask)
router.put("/update",authMiddleware,updateTask)

export{router as taskFunc}