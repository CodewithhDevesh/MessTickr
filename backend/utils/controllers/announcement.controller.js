import { Announcement } from "../models/announcement.model.js";
import { User } from "../models/user.model.js";
import { Mess } from "../models/mess.model.js"

// CREATE ANNOUNCEMENT - Only Admin

export const createAnnouncement = async (req, res) => {
  try {
    const { message, mess } = req.body;
    const userId = req.id;
    //console.log("Printing the userid of user ->",userId);
    
    // 1. Verify the mess exists and belongs to the current admin
    const messDoc = await Mess.findById(mess);
    const user = await User.findById(userId);
    // console.log("printing the mess document-> ",messDoc);
    // console.log("printing the user ->",user);
    if (!messDoc) {
      return res.status(404).json({ success: false, message: "Mess not found." });
    }

    if (messDoc.adminEmail.toString() !== user.email.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to post announcements for this mess.",
      });
    }

    // 2. Create announcement
    const announcement = await Announcement.create({
      message,
      mess,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL ANNOUNCEMENTS - For both Students and Admins
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "fullname email role")  // Show admin info
      .populate("mess", "name location")             // Show mess info
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Announcements fetched successfully.",
      announcements,
      success: true,
    });
  } catch (error) {
    console.error("Get Announcements Error:", error);
    return res.status(500).json({
      message: "Server error while fetching announcements.",
      success: false,
    });
  }
};

// DELETE ANNOUNCEMENT - Only by creator admin
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.id;

    const user = await User.findById(adminId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized. Only admins can delete announcements.",
        success: false,
      });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
        success: false,
      });
    }

    if (announcement.createdBy.toString() !== adminId) {
      return res.status(403).json({
        message: "You can only delete your own announcements.",
        success: false,
      });
    }

    await announcement.deleteOne();

    return res.status(200).json({
      message: "Announcement deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Delete Announcement Error:", error);
    return res.status(500).json({
      message: "Server error while deleting announcement.",
      success: false,
    });
  }
};
