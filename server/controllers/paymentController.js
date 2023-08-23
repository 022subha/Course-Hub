import crypto from "crypto";
import { razorpayInstance } from "../index.js";
import { Payment } from "../models/paymentModel.js";
import { User } from "../models/userModel.js";

export const getKey = async (req, res) => {
  try {
    return res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const buySubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    const plan_id =
      plan === "Iconic" ? process.env.ICONIC_PLAN_ID : process.env.PLUS_PLAN_ID;

    const user = await User.findById(req.user._id);

    if (user.role === "admin")
      return res
        .status(201)
        .json({ success: false, message: "Admin can't buy subscription." });

    const subscription = await razorpayInstance.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
    await user.save();

    return res
      .status(200)
      .json({ success: true, subscriptionId: subscription.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body.response;

    const user = await User.findById(req.user._id);

    const body = razorpay_payment_id + "|" + razorpay_subscription_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const payment = new Payment({
        subscriptionId: razorpay_subscription_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        createdBy: user._id,
      });

      await payment.save();

      user.subscription.status = "active";
      await user.save();
      res.json({
        success: true,
        message: "Payment Successful.",
        reference: razorpay_payment_id,
        updatedUser: user,
      });
    } else {
      res.json({
        success: false,
        message: "Payment Failed.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscription_id = user.subscription.id;

    let refund = false;

    await razorpayInstance.subscriptions.cancel(subscription_id);

    const payment = await Payment.findOne({ subscriptionId: subscription_id });

    const gap = Date.now() - payment.createdAt;

    const refundTime = process.env.REFUND_TIME * 24 * 60 * 60 * 1000;

    if (refundTime > gap) {
      await razorpayInstance.payments.refund(payment.paymentId);
      refund = true;
    }

    await payment.deleteOne();
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: refund
        ? `Your subscription cancelled. You will get your refund within 7 days.`
        : `Your subscription cancelled. You will get any refund as you have cancelled your subscription after ${process.env.REFUND_TIME} days.`,
      updatedUser: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
