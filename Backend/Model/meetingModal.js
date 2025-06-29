"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Message Schema
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
const meetingSchema = new mongoose_1.Schema({
    admin_id: {
        type: String,
        ref: "Admin",
        required: true,
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    MeetingTime: {
        type: Date,
        required: true,
    },
    roomId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
        required: true, // Optional: ensures that the status field is required
    },
    members: [memberSchema],
});
const MeetingModel = mongoose_1.default.model("Meeting", meetingSchema);
exports.default = MeetingModel;
