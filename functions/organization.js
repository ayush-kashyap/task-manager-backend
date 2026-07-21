import { Router } from "express";
import { authMiddleware } from "./authenticate.js";
import { OrganizationModel } from "../schemas/Organization.js";
import moment from "moment";
const router = Router();

const createOrganization = async (req, res) => {
  var data = req.body;
  if (data) {
    if (data.name) {
      data.primary_user = req.id;
      data.members = [req.id];
      data.total_members = 1;
      data.created_at = moment().format();
      try {
        var createdOrg = await OrganizationModel.create(data);
        if (createdOrg) {
          res.status(201).send({ detail: "Organization created successfully" });
        } else {
          res.status(500).send({
            detail: "Internal Server Error: Organization not created",
          });
        }
      } catch (e) {
        res
          .status(500)
          .send({ detail: "Internal Server Error: Organization not created" });
      }
    } else {
      res.status(400).send({ detail: "Incomplete data provided" });
    }
  } else {
    res.status(400).send({ detail: "No organization data provided" });
  }
};
const getOrganizationMembers = async (req, res) => {
  const data = req?.id;
  try {
    const fetchedData = await OrganizationModel.findOne({
      primary_user: data,
    })
      .populate("members", "-password -firebaseUid")
      .select("members");

    if (fetchedData.members.length > 0) {
      res.status(200).json({
        success: true,
        detail: "Organization members fetched successfully",
        data: fetchedData.members,
      });
    } else {
      res.status(404).json({
        success: false,
        detail: "Organization members not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      detail: "Internal Server Error",
      error: error,
    });
  }
};

router.post("/create", authMiddleware, createOrganization);
router.get("/get-members", authMiddleware, getOrganizationMembers);

export { router as organization };
