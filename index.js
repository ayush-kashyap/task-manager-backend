import Express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { auth } from "./functions/auth.js";
import { getUser } from "./functions/getUser.js";
import { taskFunc } from "./functions/taskfunc.js";
import { organization } from "./functions/organization.js";
import { rateLimit } from "express-rate-limit";

const app = Express();
app.use(cors());
app.use(json());
mongoose.connect(process.env.MONGOURL, console.log("Database Connected"));

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 30,
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});
app.listen(5500);
app.use(generalLimiter);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    detail: "Backend active!",
  });
});
app.use("/auth", authLimiter, auth);
app.use("/organization", organization);
app.use("/get", getUser);
app.use("/task", taskFunc);
