import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
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

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()) })
      .json({ success: true, message: "Logged Out Successfully." });
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

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res
        .status(201)
        .json({ success: false, message: "Please enter all fields." });

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(202)
        .json({ success: false, message: "Enter the correct old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password Changed Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { file } = req.files;
    const avatar = await cloudinary.v2.uploader.upload(file.tempFilePath);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    user.avatar = {
      public_id: avatar.public_id,
      url: avatar.secure_url,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Picture Updated Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(201)
        .json({ success: false, message: "No user exists." });
    }

    const resetToken = await crypto.randomBytes(20).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Course Hub Reset Password",
      text: `To change password please click on the link. ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
      from: "coursehub@admin.com",
    });

    return res.status(200).json({
      success: true,
      message: `Reset Link has been sent to ${user.email}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(201).json({
        success: false,
        message: "Token is invalid or has been expired.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully.",
    });
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

    return res
      .status(203)
      .json({
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

export const deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.deleteOne();
    return res
      .status(200)
      .cookie("token", null, { expiresIn: new Date(Date.now()) })
      .json({ success: true, message: `Profile deleted successfully.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
