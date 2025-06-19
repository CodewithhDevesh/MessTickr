import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model (admin)
    required: true,
  },
  mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mess", // Reference to Mess model
    required: true,
  },
}, { timestamps: true });

export const Announcement = mongoose.model("Announcement", announcementSchema);
