import cloudinary from "cloudinary";
import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select("-lectures")
      .populate("createdBy");

    return res.status(201).json({
      allCourses: courses,
      success: true,
      message: `${
        courses.length ? courses.length : "No"
      } Course are Found...!!!`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, createdBy } = req.body;

    const file = req.files?.file;

    if (!title || !description || !category || !createdBy)
      return res
        .status(201)
        .json({ success: false, message: "Please add all fields !!" });

    const poster = await cloudinary.v2.uploader.upload(file.tempFilePath);

    const newCourse = new Course({
      title,
      description,
      category,
      createdBy: req.user._id,
      poster: { public_id: poster.public_id, url: poster.secure_url },
    });

    await newCourse.save();

    return res.status(200).json({
      success: true,
      message: "Course created successfully. You can add lectures now.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLectures = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res
        .status(201)
        .json({ success: false, message: "No such course exists." });
    }

    if (req.user.role === "user") course.views++;
    await course.save();

    return res.status(200).json({ success: true, courseData: course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addLectures = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const { file } = req.files;

    const course = await Course.findById(id);

    if (!course) {
      return res
        .status(201)
        .json({ success: false, message: "No such course exists." });
    }

    const myFile = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      resource_type: "video",
    });

    course.lectures.push({
      title,
      description,
      video: {
        public_id: myFile.public_id,
        url: myFile.secure_url,
      },
    });

    course.noOfVideos = course.lectures.length;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture added successfully.",
      lecture: {
        title,
        description,
        video: {
          public_id: myFile.public_id,
          url: myFile.secure_url,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res
        .status(201)
        .json({ success: false, message: "No such course exists." });
    }

    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for (let index = 0; index < course.lectures.length; index++) {
      await cloudinary.v2.uploader.destroy(
        course.lectures[index].video.public_id,
        { resource_type: "video" }
      );
    }

    const users = await User.find();
    for (let i = 0; i < users.length; i++) {
      users[i].playlist = users[i].playlist.filter((item) => {
        item.course.toString() !== id.toString();
      });
      await users[i].save();
    }

    await course.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Course Deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.query;

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(201)
        .json({ success: false, message: "No such course exists." });
    }

    const lecture = course.lectures.find(
      (item) => item._id.toString() === lectureId.toString()
    );

    if (!lecture)
      return res.status(202).json({
        success: false,
        message: "No such lecture exist in the course.",
      });

    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
      resource_type: "video",
    });

    course.lectures = course.lectures.filter(
      (item) => item._id.toString() !== lectureId.toString()
    );
    course.noOfVideos = course.lectures.length;

    await course.save();

    return res
      .status(200)
      .json({ success: true, message: "Lecture deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
