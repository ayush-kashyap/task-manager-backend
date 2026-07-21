import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../schemas/User.js";
import admin from "../utils/firebaseAdmin.js";
import { getHighQualityGoogleImage } from "../utils/common_functions.js";

const router = Router();

const userSignup = async (req, res) => {
  const data = req.body;
  if (data.name != "" && data.password != "" && data.email != "") {
    try {
      var user = await UserModel.findOne({ email: data.email });
      if (user) {
        res.status(409).send();
      } else {
        var salt = await bcrypt.genSalt(10);
        var pass = await bcrypt.hash(data.password, salt);
        data.password = pass;
        await UserModel.create(data);
        res
          .status(201)
          .send({ success: true, msg: "User created succesfully" });
      }
    } catch (error) {
      res.status(500).send();
    }
  } else {
    res.status(404).send();
  }
};
const UserLogin = async (req, res) => {
  const data = req.body;
  if (data.password != "" && data.email != "") {
    const user = await UserModel.findOne({ email: data.email });
    if (user !== null) {
      var matched = await bcrypt.compare(data.password, user.password);
      if (matched) {
        var token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.SECRETKEY,
        );
        res.status(200).send({ success: true, detail: "Logged in", token });
      } else
        res.status(401).send({
          success: false,
          detail:
            "Invalid credentials ! Please make sure you are using correct password",
        });
    } else {
      res.status(404).send({
        success: false,
        detail: "No account associated with this email Id.",
      });
    }
  } else {
    res.status(404).send({ success: false, detail: "No data!" });
  }
};
const firebaseLogin = async (req, res) => {
  const { firebaseToken } = req.body;
  if (!firebaseToken) {
    return res
      .status(400)
      .json({ success: false, msg: "Missing firebaseToken" });
  }

  try {
    if (!admin.apps || admin.apps.length === 0) {
      return res.status(500).json({
        success: false,
        msg: "Firebase Admin SDK is not initialized on backend. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in backend .env file.",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, msg: "Email not provided by Firebase token" });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name: name || email.split("@")[0],
        email: email,
        firebaseUid: uid,
        photo_url: getHighQualityGoogleImage(picture),
        password: "",
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = uid;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRETKEY,
    );

    res.status(200).send({ success: true, msg: "Logged in via Google", token });
  } catch (error) {
    console.error("Firebase Login Error:", error);
    res.status(401).json({
      success: false,
      msg: "Invalid or expired Firebase token",
      error: error.message,
    });
  }
};

router.post("/usersignup", userSignup);
router.post("/userlogin", UserLogin);
router.post("/firebase-login", firebaseLogin);

export { router as auth };
