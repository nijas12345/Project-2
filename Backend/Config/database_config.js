"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_connection = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            console.error("MONGO_URL is not defined in the environment variables.");
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoUrl);
        console.log("mongoDb Connected");
    }
    catch (error) {
        console.log("Database is not connected", error);
    }
};
exports.default = database_connection;
