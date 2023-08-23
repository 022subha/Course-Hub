import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  subscriptionId: { type: String, required: true },
  paymentId: { type: String, required: true },
  signature: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
