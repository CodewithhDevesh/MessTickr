// controllers/settings.controller.js
import { Settings } from "../models/settings.model.js";

export const updateSettings = async (req, res) => {
  try {
    const { messId, cutoffTime } = req.body;
   // console.log("printing the cutoffs",cutoffTime);
    
    if (!messId || !cutoffTime) {
      return res.status(400).json({ message: "Mess ID and cutoff times are required" });
    }

    const updated = await Settings.findOneAndUpdate(
      { messId },
      { cutoffTime },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Cutoff time updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Add this to settings.controller.js
export const getCutoffByMessId = async (req, res) => {
  try {
    const { messId } = req.params;
    //console.log("pring the mess - >",req.params);
    
    if (!messId) {
      return res.status(400).json({ message: "Mess ID is required" });
    }

    const settings = await Settings.findOne({ messId });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res.status(200).json({ cutoffTime: settings.cutoffTime });
  } catch (error) {
    console.error("Error fetching cutoff time:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
