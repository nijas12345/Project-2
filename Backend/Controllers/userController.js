"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const HttpError_1 = require("../Utils/HttpError");
const handleError_1 = require("../Utils/handleError");
class UserController {
    constructor(userService) {
        this.register = async (req, res) => {
            try {
                const refferalCode = req.query.refferalCode;
                const userData = req.body;
                userData.refferalCode = refferalCode;
                await this.userService.register(userData);
                res.status(httpStatusCode_1.default.OK).send("OTP send to mail");
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.otpVerification = async (req, res) => {
            try {
                const enteredOTP = req.body.otp;
                console.log(enteredOTP);
                await this.userService.otpVerification(enteredOTP);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.resendOTP = async (req, res) => {
            try {
                await this.userService.resendOTP();
                res.status(httpStatusCode_1.default.OK).send("OTP sended");
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const serviceResponse = await this.userService.login(email, password);
                res.cookie("RefreshToken", serviceResponse.refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("AccessToken", serviceResponse.userToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 30 * 60 * 1000,
                });
                res.status(httpStatusCode_1.default.OK).json(serviceResponse.userData);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.verifyGoogleAuth = async (req, res) => {
            try {
                const token = req.body.token;
                const serviceResponse = await this.userService.verifyGoogleAuth(token);
                res.cookie("RefreshToken", serviceResponse.refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("AccessToken", serviceResponse.userToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 30 * 60 * 1000,
                });
                res.status(httpStatusCode_1.default.OK).json(serviceResponse.userData);
            }
            catch (error) {
                console.log("User:= google login error", error);
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const email = req.body.email;
                await this.userService.resetPassword(email);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.validateToken = async (req, res) => {
            try {
                const token = req.body.token;
                await this.userService.validateToken(token);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.confirmResetPassword = async (req, res) => {
            try {
                const token = req.body.token;
                const password = req.body.password;
                await this.userService.confirmResetPassword(token, password);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const user_id = req.user_id;
                const user = req.body;
                const serviceResponse = await this.userService.updateUser(user_id, user);
                console.log(serviceResponse);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.logout = async (req, res) => {
            try {
                res.clearCookie("AccessToken", {
                    httpOnly: true,
                });
                res.clearCookie("RefreshToken", {
                    httpOnly: true,
                });
                res.status(httpStatusCode_1.default.OK).json("Logged out successfully");
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.profilePicture = async (req, res) => {
            try {
                const user_id = req.user_id;
                const file = req.file;
                if (!file)
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No file provided");
                const serviceResponse = await this.userService.profilePicture(user_id, file.path);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.addRefferalCode = async (req, res) => {
            try {
                const user_id = req.user_id;
                const refferalCode = req.body.refferalCode;
                const serviceResponse = await this.userService.addRefferalCode(user_id, refferalCode);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.userService = userService;
    }
}
exports.default = UserController;
