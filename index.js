import Express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import { auth } from './functions/auth.js'
import { getUser } from './functions/getUser.js'
import { taskFunc } from './functions/taskfunc.js'

const app= Express()
app.use(cors())
app.use(json())
mongoose.connect(process.env.MONGOURL,console.log("Database Connected"))
app.listen(5500,console.log("ahiii"))
app.use('/auth',auth)
app.use('/get',getUser)
app.use('/task',taskFunc)
