"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    user: {
        type: String,
    },
    text: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
});
const taskSchema = new mongoose_1.Schema({
    admin_id: {
        type: String,
        ref: "Admin",
        required: true,
    },
    taskName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    member: {
        type: String,
        required: true,
    },
    projectId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    taskImage: {
        type: String,
    },
    deadline: {
        type: String,
    },
    acceptanceStatus: {
        type: String,
        enum: ["unAssigned", "active", "reAssigned"],
        default: "unAssigned",
        required: false
    },
    status: {
        type: String,
        enum: ["pending", "inProgress", "completed"],
        default: "pending",
        required: false
    },
    comments: [commentSchema],
});
const taskModel = (0, mongoose_1.model)("Task", taskSchema);
exports.default = taskModel;
