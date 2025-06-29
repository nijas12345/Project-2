"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Member Schema
const memberSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Member"] },
    status: { type: String, default: "pending" },
    invitedAt: { type: Date, default: Date.now },
});
// Company Schema
const companySchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    description: { type: String, required: true },
    refferalCode: { type: String, required: true },
    members: [memberSchema],
});
const CompanyModel = (0, mongoose_1.model)("Company", companySchema);
exports.default = CompanyModel;
