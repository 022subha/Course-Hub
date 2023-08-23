import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name...!!"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email...!!"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password...!!"],
    minLength: [6, "Password must be at least of 6 characters...!!"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  subscription: {
    id: String,
    status: String,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: String,
    },
  ],
  createdAt: { type: Date, default: Date.now() },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

export const User = mongoose.model("User", userSchema);
