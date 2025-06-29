"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
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
const paymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = paymentModel;
