import { MealFeedback } from "../models/feedback.model.js";
import { User } from "../models/user.model.js";
import { Mess } from "../models/mess.model.js";

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const userId = req.id;
    const tokenMessId = req.messId; // from token middleware

    const {
      date,
      mealType,
      rating,
      comment,
      messId: clientMessId, // messId sent from frontend
    } = req.body;

    const finalMessId = clientMessId || tokenMessId; // pick client's messId first

    // console.log("Mess ID from client:", clientMessId);
    // console.log("Mess ID from token:", tokenMessId);
    // console.log("Final Mess ID used:", finalMessId);

    if (!date || !mealType || rating == null || !finalMessId) {
      return res.status(400).json({
        message: "Date, meal type, rating, and mess ID are required.",
        success: false,
      });
    }

    const validMeals = ["breakfast", "lunch", "noshes", "dinner"];
    if (!validMeals.includes(mealType)) {
      return res.status(400).json({
        message: "Invalid meal type.",
        success: false,
      });
    }

    const feedback = await MealFeedback.create({
      messId: finalMessId,
      userId,
      date,
      mealType,
      rating,
      comment,
    });

   // console.log("Feedback created:", feedback);

    return res.status(201).json({
      message: "Feedback submitted successfully.",
      feedback,
      success: true,
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    return res.status(500).json({
      message: "Server error while submitting feedback.",
      success: false,
    });
  }
};


// Get all feedbacks (Admin only)

export const getAllFeedbacks = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized. Only admins can view feedbacks.",
        success: false,
      });
    }

    // Fetch all messes created by this admin (by email)
    const messes = await Mess.find({ adminEmail: user.email });
    const messIds = messes.map((mess) => mess._id);

    if (!messIds.length) {
      return res.status(404).json({
        message: "No messes found for this admin.",
        success: false,
      });
    }

    // Fetch feedbacks and populate mess name and user info
    const feedbacks = await MealFeedback.find({ messId: { $in: messIds } })
      .populate("userId", "fullname email hostelId")
      .populate("messId", "name") // ✅ Add this to get mess name
      .sort({ date: -1 });
      //console.log("printing the feedbacks ->",feedbacks);
      
    // Transform the feedbacks to include messName at top level
    const formattedFeedbacks = feedbacks.map((fb) => ({
      _id: fb._id,
      userId: fb.userId,
      messId: fb.messId._id,
      messName: fb.messId.name, // ✅ Add mess name here
      mealType: fb.mealType,
      rating: fb.rating,
      comment: fb.comment,
      date: fb.date,
    }));

    return res.status(200).json({
      message: "Feedbacks fetched successfully.",
      feedbacks: formattedFeedbacks,
      success: true,
    });
  } catch (error) {
    console.error("Get Feedbacks Error:", error);
    return res.status(500).json({
      message: "Server error while fetching feedbacks.",
      success: false,
    });
  }
};
