import express from "express";
import {
  addToPlaylist,
  getMyProfile,
  login,
  register,
  removeFromPlaylist,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

//user
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/my-profile").get(isAuthenticated, getMyProfile);
router.route("/add-to-playlist").post(isAuthenticated, addToPlaylist);
router
  .route("/remove-from-playlist/:id")
  .delete(isAuthenticated, removeFromPlaylist);

export default router;
