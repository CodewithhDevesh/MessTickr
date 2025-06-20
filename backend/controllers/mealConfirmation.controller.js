import { MealConfirmation } from "../models/mealConfirmation.model.js";
import { User } from "../models/user.model.js";

export const getMealConfirmation = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const mealConfirmation = await MealConfirmation.findOne({ userId, date });
    
    if (!mealConfirmation) {
      return res.status(404).json({
        message: "Meal confirmation not found for this user on this date",
        success: false,
      });
    }

    const user = await User.findById(userId);
    return res.status(200).json({
      message: "Meal confirmation fetched successfully",
      success: true,
      data: {
        ...mealConfirmation._doc,
        messName: user?.messId?.name || null,
        preferencesExist: true,
        hasPreferences: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error. Try again later.",
      success: false,
    });
  }
};

// Create or Update Meal Confirmation
export const createOrUpdateMealConfirmation = async (req, res) => {
  try {
    const { userId, date, breakfast, lunch, noshes, dinner } = req.body;

    // Validate required fields
    if (!userId || !date || breakfast === undefined || lunch === undefined || noshes === undefined || dinner === undefined) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let mealConfirmation = await MealConfirmation.findOne({ userId, date });

    if (!mealConfirmation) {
      // Create new meal confirmation if not found
      mealConfirmation = new MealConfirmation({
        userId,
        date,
        breakfast,
        lunch,
        noshes,
        dinner,
        confirmedAt: new Date(),
      });
    } else {
      // Update existing meal confirmation
      mealConfirmation.breakfast = breakfast;
      mealConfirmation.lunch = lunch;
      mealConfirmation.noshes = noshes;
      mealConfirmation.dinner = dinner;
      mealConfirmation.confirmedAt = new Date();
    }

    await mealConfirmation.save();

    return res.status(200).json({
      message: "Meal confirmation created successfully",
      success: true,
      data: mealConfirmation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error. Try again later.",
      success: false,
    });
  }
};
export const updateMealConfirmation = async (req, res) => {
  try {
    const { userId, date, breakfast, lunch, noshes, dinner } = req.body;

    if (!userId || !date || breakfast === undefined || lunch === undefined || noshes === undefined || dinner === undefined) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Find existing meal confirmation only
    let mealConfirmation = await MealConfirmation.findOne({ userId, date });

    if (!mealConfirmation) {
      return res.status(404).json({
        message: "No existing meal confirmation found to update",
        success: false,
      });
    }

    // Update fields
    mealConfirmation.breakfast = breakfast;
    mealConfirmation.lunch = lunch;
    mealConfirmation.noshes = noshes;
    mealConfirmation.dinner = dinner;
    mealConfirmation.confirmedAt = new Date();

    await mealConfirmation.save();

    return res.status(200).json({
      message: "Meal confirmation updated successfully",
      success: true,
      data: mealConfirmation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error. Try again later.",
      success: false,
    });
  }
};
