"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const HttpError_1 = require("../Utils/HttpError");
const handleError_1 = require("../Utils/handleError");
class AdminController {
    constructor(adminService) {
        // Admin Registration
        this.register = async (req, res) => {
            try {
                const adminData = req.body;
                await this.adminService.register(adminData);
                res
                    .status(httpStatusCode_1.default.OK)
                    .send("Admin registered successfully and OTP sent to email");
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        // OTP Verification
        this.otpVerification = async (req, res) => {
            try {
                const enteredOTP = req.body.otp;
                console.log(enteredOTP);
                const serviceResponse = await this.adminService.otpVerification(enteredOTP);
                console.log(serviceResponse);
                res.status(httpStatusCode_1.default.OK).send(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        // Resend OTP
        this.resendOTP = async (req, res) => {
            try {
                await this.adminService.resendOTP();
                res.status(httpStatusCode_1.default.OK).send("OTP sent again");
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        // Admin Login
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                console.log(req.body);
                const serviceResponse = await this.adminService.login(email, password);
                res.cookie("AdminRefreshToken", serviceResponse.adminRefreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("AdminAccessToken", serviceResponse.adminToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 30 * 60 * 1000,
                });
                res.status(httpStatusCode_1.default.OK).json(serviceResponse.adminData);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        // Verify Google Authentication for Admin
        this.verifyGoogleAuth = async (req, res) => {
            try {
                const token = req.body.token;
                const serviceResponse = await this.adminService.verifyGoogleAuth(token);
                res.cookie("AdminRefreshToken", serviceResponse.adminRefreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("AdminAccessToken", serviceResponse.adminToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 30 * 60 * 1000,
                });
                res.status(httpStatusCode_1.default.OK).json(serviceResponse.adminData);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const email = req.body.email;
                await this.adminService.resetPassword(email);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.validateToken = async (req, res) => {
            try {
                const token = req.body.token;
                await this.adminService.validateToken(token);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.confirmResetPassword = async (req, res) => {
            try {
                const token = req.body.token;
                const password = req.body.passord;
                await this.adminService.confirmResetPassword(token, password);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.logout = async (req, res) => {
            try {
                res.clearCookie("AdminAccessToken", {
                    httpOnly: true,
                });
                res.clearCookie("AdminRefreshToken", {
                    httpOnly: true,
                });
                res.status(httpStatusCode_1.default.OK).send("Logged out successfully");
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.blockUser = async (req, res) => {
            try {
                const { user_id } = req.body;
                const serviceResponse = await this.adminService.userBlock(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.unBlockUser = async (req, res) => {
            try {
                const { user_id } = req.body;
                const serviceResponse = await this.adminService.userUnBlock(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.updateAdmin = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const admin = req.body;
                const serviceResponse = await this.adminService.updateAdmin(admin_id, admin);
                console.log(serviceResponse);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.adminProfilePicture = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const file = req.file;
                if (!file)
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No file provided");
                const profileURL = await this.adminService.adminProfilePicture(admin_id, file);
                res.status(httpStatusCode_1.default.OK).json(profileURL);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.adminService = adminService;
    }
}
exports.default = AdminController;
