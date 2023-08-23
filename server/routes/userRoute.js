import express from "express";
import {
  addToPlaylist,
  changePassword,
  deleteMyProfile,
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateProfilePicture,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

//user
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/my-profile").get(isAuthenticated, getMyProfile);
router.route("/change-password").put(isAuthenticated, changePassword);
router.route("/update-profile").put(isAuthenticated, updateProfile);
router
  .route("/update-profile-picture")
  .put(isAuthenticated, updateProfilePicture);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/add-to-playlist").post(isAuthenticated, addToPlaylist);
router
  .route("/remove-from-playlist/:id")
  .delete(isAuthenticated, removeFromPlaylist);

router.route("/delete-my-profile").delete(isAuthenticated, deleteMyProfile);

export default router;
