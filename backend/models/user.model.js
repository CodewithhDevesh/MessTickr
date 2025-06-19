import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
    },
    mess: {
      messId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mess",
      },
      name: String,
      location: String,
      contactNumber: String,
    },

    profile: {
      branch: {
        type: String,
      },
      year: {
        type: Number,
      },
      photoUrl: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        maxlength: 150,
      },
    },
    resetToken: {
        type: String
      },
      resetTokenExpire: {
        type: Date
      },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
