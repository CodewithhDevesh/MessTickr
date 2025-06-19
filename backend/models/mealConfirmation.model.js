import mongoose from "mongoose";

const mealConfirmationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // fullname: {
    //     type: String,
    // },
    date: {
        type: Date,
        required: true,
    },
    breakfast: {
        type: Boolean,
        default: false,
    },
    lunch: {
        type: Boolean,
        default: false,
    },
    noshes: {
        type: Boolean,
        default: false,
    },
    dinner: {
        type: Boolean,
        default: false,
    },
    confirmedAt: {
        type: Date,
        default: Date.now, 
    },
}, { timestamps: true });

export const MealConfirmation = mongoose.model("MealConfirmation", mealConfirmationSchema);
