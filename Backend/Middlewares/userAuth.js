"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModal_1 = __importDefault(require("../Model/userModal"));
const userRepository_1 = __importDefault(require("../Repositories/userRepository"));
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const userRepository = new userRepository_1.default(userModal_1.default);
async function isBloked(req, res, next) {
    try {
        const user_id = req.user_id;
        if (!user_id) {
            res
                .status(httpStatusCode_1.default.Unauthorized)
                .json({ message: "Access denied. User ID not found." });
            return;
        }
        const userData = await userRepository.userIsBlocked(user_id);
        if (!userData)
            throw new Error("No user Data");
        const isBlocked = userData.isBlocked;
        console.log("user is blocked => ", isBlocked);
        if (isBlocked === true) {
            res
                .status(httpStatusCode_1.default.Unauthorized)
                .json({ message: "Access denied. User is blocked." });
            return;
        }
        next();
    }
    catch (error) {
        res
            .status(httpStatusCode_1.default.InternalServerError)
            .json({ message: "Server error." });
        return;
    }
}
exports.default = isBloked;
