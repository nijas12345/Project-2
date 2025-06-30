import { InferSchemaType, Schema, Types, model } from "mongoose";

const paymentSchema = new Schema({
  admin_id: {
    type: String,
    ref: "Admin",
    required: true,
  },
  subscription: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "pending", "canceled"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: String,
  },
});

export type PaymentInput = InferSchemaType<typeof paymentSchema>;
export type PaymentDoc = PaymentInput & { _id: Types.ObjectId };

const paymentModel = model<PaymentDoc>("Payment", paymentSchema);
export default paymentModel;
