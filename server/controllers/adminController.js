import cloudinary from "cloudinary";
import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res
      .status(200)
      .json({ success: true, message: `${users.length} users found.`, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(201)
        .json({ success: false, message: "No such user exist." });
    }

    if (user.role === "user") user.role = "admin";
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: `${user.name} is now admin.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(201)
        .json({ success: false, message: "No such user exist." });
    }

    if (user.role === "admin")
      return res.status(202).json({
        success: false,
        message: `${user.name} is admin. You can't delete this user.`,
      });

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    //cancel subscription
    await user.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: `User deleted successfully.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStat = async (req, res) => {
  try {
    const courses = await Course.find();
    const users = await User.find();
    const views = courses.reduce((sum, course) => sum + course.views, 0);
    let subscriptionLength = 0;
    for (let i = 0; i < users.length; i++) {
      if (users[i]?.subscription?.status === "active") subscriptionLength++;
    }
    return res
      .status(200)
      .json({ views, users: users.length, subscriptions: subscriptionLength });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
