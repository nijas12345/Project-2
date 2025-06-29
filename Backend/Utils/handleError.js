"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const HttpError_1 = require("./HttpError"); // Adjust path
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
function handleError(error, res) {
    if (error instanceof HttpError_1.HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Unhandled Error:", error);
    return res
        .status(httpStatusCode_1.default.InternalServerError)
        .json({ message: "Something went wrong. Please try again later." });
}
