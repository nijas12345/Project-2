"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const memberSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Member"],
    },
});
const projectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    admin_id: {
        type: String,
        ref: "Admin",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    members: [memberSchema],
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
});
const projectModel = (0, mongoose_1.model)('Project', projectSchema);
exports.default = projectModel;
