import { MealConfirmation } from "../models/mealConfirmation.model.js";
import { Mess } from "../models/mess.model.js";
import { User } from "../models/user.model.js";


export const registerMess = async (req, res) => {
  try {
    const { name, location, adminEmail, contactNumber } = req.body;
    const userId = req.id;
    if (!name || !adminEmail || !location) {
      return res.status(400).json({
        message: "Mess name, location, and admin email are required.",
        success: false,
      });
    }

    const existing = await Mess.findOne({ name, location });
    if (existing) {
      return res.status(409).json({
        message: "A mess with this name and location already exists.",
        success: false,
      });
    }

    const mess = await Mess.create({
      name,
      location,
      adminEmail,
      contactNumber,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Mess registered successfully.",
      success: true,
      data: mess,
    });
  } catch (error) {
    console.error("Register Mess Error:", error);
    return res.status(500).json({
      message: "Server error while registering mess.",
      success: false,
    });
  }
};

export const getAllMesses = async (req, res) => {
  try {
    const messes = await Mess.find().sort({ registeredAt: -1 });
    return res.status(200).json({
      message: "Messes fetched successfully.",
      success: true,
      data: messes,
    });
  } catch (error) {
    console.error("Get Messes Error:", error);
    return res.status(500).json({
      message: "Server error while fetching messes.",
      success: false,
    });
  }
};

export const getMessById = async (req, res) => {
  try {
    const userAdmin = await User.findById(req.params.id);
    if (!userAdmin) {
      return res.status(404).json({
        message: "Admin user not found.",
        success: false,
      });
    }

    // ✅ Fetch all messes registered by this admin's email
    const messes = await Mess.find({ adminEmail: userAdmin.email.toLowerCase() });

    if (!messes || messes.length === 0) {
      return res.status(404).json({
        message: "No messes found for this admin.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Messes fetched successfully.",
      success: true,
      data: messes,
    });
  } catch (error) {
    console.error("Get Mess Error:", error);
    return res.status(500).json({
      message: "Server error while fetching mess.",
      success: false,
    });
  }
};

export const getMessWithStudentsAndMeals = async (req, res) => {
  try {
    const userAdmin = await User.findById(req.params.id);
   // console.log("printing the admin ->",userAdmin);
    
    if (!userAdmin) {
      return res.status(404).json({
        message: "Admin user not found.",
        success: false,
      });
    }

    // Fetch all messes managed by this admin
    const messes = await Mess.find({ adminEmail: userAdmin.email.toLowerCase() });
    if (!messes.length) {
      return res.status(404).json({
        message: "No messes found for this admin.",
        success: false,
      });
    }

    const messIds = messes.map(m => m._id);

    // Fetch all students belonging to these messes
    const students = await User.find({ "mess.messId": { $in: messIds } }).select("_id fullname mess");

    const studentIds = students.map(s => s._id);

    // Optionally, filter meal confirmations by date (from query)
    const mealFilter = { userId: { $in: studentIds } };
    if (req.query.date) {
      const date = new Date(req.query.date);
      mealFilter.date = date;
    }

    // Fetch meal confirmations and populate student info
    const mealConfirmations = await MealConfirmation.find(mealFilter).populate("userId", "fullname mess");

    // Organize data mess-wise for frontend convenience
    const messData = messes.map(mess => {
      const studentsInMess = students.filter(s => s.mess.messId.equals(mess._id));
      const studentIdsInMess = studentsInMess.map(s => s._id.toString());
      const mealsInMess = mealConfirmations.filter(mc => studentIdsInMess.includes(mc.userId._id.toString()));

      return {
        mess,
        students: studentsInMess,
        mealConfirmations: mealsInMess,
      };
    });

    return res.status(200).json({
      message: "Messes, students, and meal preferences fetched successfully.",
      success: true,
      data: messData,
    });
  } catch (error) {
    console.error("Get Mess with Students and Meals Error:", error);
    return res.status(500).json({
      message: "Server error while fetching mess, students, or meals.",
      success: false,
    });
  }
};


export const selectMess = async (req, res) => {
  try {
    const messId = req.body.messId;
    const userId = req.id;

    if (!messId) {
      return res.status(400).json({
        success: false,
        message: "Mess ID is required.",
      });
    }

    const user = await User.findById(userId);
    const mess = await Mess.findById(messId);
    //console.log("Printing the mess name->",mess.name);

    if (!user || !mess) {
      return res.status(404).json({
        success: false,
        message: "User or Mess not found.",
      });
    }

    // Save mess details into user's profile
    user.mess = {
      messId: mess._id,
      name: mess.name,
      location: mess.location,
      contactNumber: mess.contactNumber,
    };

    const updatedUser = await user.save();
    //console.log(updatedUser);

    return res.status(200).json({
      success: true,
      message: "Mess selected successfully.",
      selectedMess: updatedUser.mess,
    });
  } catch (error) {
    console.error("Select Mess Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while selecting mess.",
    });
  }
};

// GET /api/mess/selected/:userId
export const getSelectedMess = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user || !user.mess) {
      return res.status(404).json({
        success: false,
        message: "No mess selected by this user.",
      });
    }
    //console.log("printing the user",user.mess);

    return res.status(200).json({
      success: true,
      data: user.mess,
    });
  } catch (error) {
    console.error("Get Selected Mess Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching selected mess.",
    });
  }
};

export const deleteMessById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.id;
    
    const user = await User.findById(adminId);
        if (!user || user.role !== "admin") {
          return res.status(403).json({
            message: "Unauthorized. Only admins can delete mess.",
            success: false,
          });
        }

    const deleted = await Mess.findById(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Mess not found" });
    }
    
    if (deleted.createdBy.toString() !== adminId) {
      return res.status(403).json({
        message: "You can only delete your own registered messes.",
        success: false,
      });
    }
    await deleted.deleteOne();
    res.status(200).json({
      success: true,
      message: "Mess deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting mess:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};