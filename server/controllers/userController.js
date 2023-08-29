import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.files?.file;

    if (!name || !email || !password) {
      return res
        .status(201)
        .json({ success: false, message: "Please enter all fields!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(202)
        .json({ success: false, message: "User already exsists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatar = await cloudinary.v2.uploader.upload(file.tempFilePath);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: { public_id: avatar.public_id, url: avatar.secure_url },
    });

    await newUser.save();

    return res
      .status(203)
      .json({ success: true, message: "User Registered Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(201)
        .json({ success: false, message: "Please enter all fields." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(202)
        .json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(203)
        .json({ success: false, message: "Invalid Credentials." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res
      .status(200)
      .json({ success: true, message: `Welcome Back ${user.name}.`, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToPlaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if (!course) {
      return res
        .status(201)
        .json({ success: false, message: "Inavlid Course Id." });
    }

    const itemExist = user.playlist.find(
      (item) => item.course.toString() === course._id.toString()
    );

    if (itemExist) {
      return res
        .status(202)
        .json({ success: false, message: "Already exist in the playlist." });
    }
    user.playlist.push({
      course: course._id,
      poster: course.poster.url,
    });

    await user.save();

    return res.status(203).json({
      success: true,
      message: "Added to playlist.",
      updatedUser: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromPlaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res
        .status(201)
        .json({ success: false, message: "Inavlid Course Id." });
    }

    const itemExist = user.playlist.find(
      (item) => item.course.toString() === course._id.toString()
    );

    if (!itemExist) {
      return res
        .status(202)
        .json({ success: false, message: "No such course in your playlist." });
    }
    const newPlaylist = user.playlist.filter(
      (item) => item.course.toString() !== course._id.toString()
    );

    user.playlist = newPlaylist;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Removed from playlist.",
      updatedUser: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
