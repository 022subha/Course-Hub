import express from "express";
import {
  buySubscription,
  cancelSubscription,
  getKey,
  paymentVerification,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/get-key").get(isAuthenticated, getKey);
router.route("/buy-subscription").post(isAuthenticated, buySubscription);
router
  .route("/payment-verification")
  .post(isAuthenticated, paymentVerification);
router
  .route("/cancel-subscription")
  .delete(isAuthenticated, cancelSubscription);

export default router;
