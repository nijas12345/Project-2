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
// Define schema without typing it explicitly
const messageSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    senderId: {
        type: String,
        refPath: "senderRole",
        required: true,
    },
    senderRole: {
        type: String,
        enum: ["Admin", "User"],
    },
    senderName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: "",
    },
    sentAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    time: {
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    sent: {
        type: Boolean,
        default: false,
    },
    readBy: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    imageFile: {
        name: { type: String },
        type: { type: String },
        data: { type: String },
        url: { type: String },
    },
});
const MessageModel = (0, mongoose_1.model)("Message", messageSchema);
exports.default = MessageModel;
