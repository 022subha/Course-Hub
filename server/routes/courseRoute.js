import express from "express";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllCourses,
  getAllLectures,
} from "../controllers/courseController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isSubscriber } from "../middlewares/isSubscriber.js";

const router = express.Router();

router.route("/get-all-courses").get(getAllCourses);
router.route("/create-course").post(isAdmin, createCourse);
router.route("/delete-course/:id").delete(isAdmin, deleteCourse);
router.route("/get-all-lectures/:id").get(isSubscriber, getAllLectures);
router.route("/add-lecture/:id").post(isAdmin, addLectures);
router.route("/delete-lecture").delete(isAdmin, deleteLecture);

export default router;
