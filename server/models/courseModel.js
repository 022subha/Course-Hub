import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Course Title...!!"],
    maxLength: [80, "Title can't exceed 80 characters...!!"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Course Description...!!"],
  },
  lectures: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      video: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    },
  ],
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  views: {
    type: Number,
    default: 0,
  },
  noOfVideos: {
    type: Number,
    default: 0,
  },
  category: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Course = mongoose.model("Course", courseSchema);
