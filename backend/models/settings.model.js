import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mess",
    required: true,
    unique: true, // One settings per mess
  },
  cutoffTime: {
    breakfast: {
      type: String,
      default: "07:30",
    },
    lunch: {
      type: String,
      default: "11:00",
    },
    noshes: {
      type: String,
      default: "15:30",
    },
    dinner: {
      type: String,
      default: "18:30",
    },
  },
}, { timestamps: true });

export const Settings = mongoose.model("Settings", settingsSchema);
