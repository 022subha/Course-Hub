import express from "express";
import { contact, requestCourse } from "../controllers/otherController.js";

const router = express.Router();

router.route("/contact").post(contact);
router.route("/request-course").post(requestCourse);

export default router;
