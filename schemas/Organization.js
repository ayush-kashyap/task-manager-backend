import mongoose, { Schema } from "mongoose";

const organization = new Schema({
  name: {
    type: "String",
    required: true,
  },
  primary_user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  logo_url: {
    type: "String",
    required: false,
  },
  created_at: {
    type: "String",
    required: false,
  },
  modified_at: {
    type: "String",
    required: false,
  },
  is_active: {
    type: "Boolean",
    default: true,
  },
  plan: {
    type: "String",
    default: "free",
  },
  total_members: {
    type: "Number",
    default: 0,
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
});

const OrganizationModel = mongoose.model("organization", organization);

export { OrganizationModel };
