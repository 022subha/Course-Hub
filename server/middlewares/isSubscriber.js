import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isSubscriber = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(201)
        .json({ success: false, message: "Not Logged In." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (user.subscription.status !== "active" && user.role !== "admin")
      return res.status(202).json({
        success: false,
        message: "You do not have a active subscription.",
      });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
