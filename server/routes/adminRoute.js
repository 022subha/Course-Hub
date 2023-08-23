import express from "express";
import {
  deleteUser,
  getAllUsers,
  getDashboardStat,
  updateUserRole,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/get-all-users").get(isAdmin, getAllUsers);
router.route("/change-user-role/:id").put(isAdmin, updateUserRole);
router.route("/delete-user/:id").delete(isAdmin, deleteUser);
router.route("/dashboard-stat").get(/* isAdmin, */ getDashboardStat);

export default router;
