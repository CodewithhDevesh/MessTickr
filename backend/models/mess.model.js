import mongoose from "mongoose";

const messSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: String,
  adminEmail: {
    type: String,
    required: true,
  },
  contactNumber: String,
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
messSchema.index({ name: 1, location: 1 }, { unique: true });
export const Mess = mongoose.model("Mess", messSchema);
