"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret_key = process.env.STRIPE_SECRET_KEY;
if (!secret_key) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
}
const stripe = new stripe_1.default(secret_key, {
    apiVersion: "2024-11-20.acacia",
});
exports.default = stripe;
