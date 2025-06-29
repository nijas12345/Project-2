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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_config_1 = require("../Config/email_config");
const jwt_config_1 = require("../Config/jwt_config");
const google_auth_library_1 = require("google-auth-library");
const cloudinary_config_1 = __importDefault(require("../Config/cloudinary_config"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const client = new google_auth_library_1.OAuth2Client(`${process.env.Google_clientID}`);
class UserServices {
    constructor(userRepository, companyRepository) {
        this.userData = null;
        this.otp = null;
        this.expiryOTP_time = null;
        this.login = async (email, password) => {
            try {
                const userData = await this.userRepository.login(email);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Email not found");
                }
                if (!userData.password) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Please login through Google");
                }
                const comparePassword = await bcrypt_1.default.compare(password, userData.password);
                if (!comparePassword) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Wrong password");
                }
                if (userData.isBlocked) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NoAccess, "User is blocked");
                }
                const userToken = (0, jwt_config_1.createToken)(userData.user_id, "USER");
                const refreshToken = (0, jwt_config_1.createRefreshToken)(userData.user_id, "USER");
                return { userToken, refreshToken, userData };
            }
            catch (error) {
                console.error("Login failed:", error);
                throw error;
            }
        };
        this.register = async (userData) => {
            try {
                const alreadyExists = await this.userRepository.findByEmail(userData.email);
                if (alreadyExists) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Conflict, "Email already exists");
                }
                this.userData = userData;
                const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
                this.otp = generatedOtp;
                console.log(`generatedOTp${generatedOtp}`);
                const isMailSended = await (0, email_config_1.sendOTPmail)(userData.email, generatedOtp);
                if (!isMailSended) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Email not sent");
                }
                const OTP_createdTime = new Date();
                this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
                return;
            }
            catch (error) {
                throw error;
            }
        };
        this.otpVerification = async (enteredOTP) => {
            try {
                if (!this.userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "User data not found");
                }
                if (enteredOTP !== this.otp) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Incorrect OTP");
                }
                const currentTime = new Date();
                if (currentTime > this.expiryOTP_time) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Expired, "OTP is expired");
                }
                console.log(enteredOTP);
                const hashedPassword = await bcrypt_1.default.hash(this.userData.password, 10);
                this.userData.password = hashedPassword;
                this.userData.user_id = (0, uuid_1.v4)();
                if (this.userData.refferalCode) {
                    const refferalCode = this.userData.refferalCode;
                    const email = this.userData.email;
                    const companyData = await this.companyRepository.updateCompanyRefferal(refferalCode, email);
                    if (!companyData) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company exist");
                    }
                }
                const response = await this.userRepository.register(this.userData);
                this.otp = null;
                this.userData = null;
                return response;
            }
            catch (error) {
                throw error;
            }
        };
        this.resendOTP = async () => {
            try {
                const Generated_OTP = Math.floor(1000 + Math.random() * 9000).toString();
                this.otp = Generated_OTP;
                console.log(`Regenearted OTP : ${Generated_OTP}`);
                const isMailSended = await (0, email_config_1.sendOTPmail)(this.userData.email, Generated_OTP);
                if (!isMailSended) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Email not sent");
                }
                const OTP_createdTime = new Date();
                this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
                return;
            }
            catch (error) {
                throw error;
            }
        };
        this.verifyGoogleAuth = async (token) => {
            try {
                // Attempt to verify the Google token
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.Google_clientID,
                });
                // Get payload and validate it exists
                const payload = ticket.getPayload();
                if (!payload || !payload.email) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Invalid Google token or email not found in payload");
                }
                let userData = await this.userRepository.verifyGoogleAuth(payload.email);
                if (!userData) {
                    let user_id = (0, uuid_1.v4)();
                    userData = await this.userRepository.createUser(payload.email, user_id);
                }
                if (userData.isBlocked) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NoAccess, // 403
                    "User is blocked");
                }
                // Generate access and refresh tokens
                const userToken = (0, jwt_config_1.createToken)(userData.user_id, "USER");
                const refreshToken = (0, jwt_config_1.createRefreshToken)(userData.user_id, "USER");
                return { userData, userToken, refreshToken };
            }
            catch (error) {
                console.error("Error verifying Google authentication:", error);
                throw error;
            }
        };
        this.resetPassword = async (email) => {
            try {
                const userData = await this.userRepository.resetPassword(email);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, // 404
                    "Sorry! You have no account in Projec-X. Please create an account");
                }
                const isMailSended = await (0, email_config_1.sendResetPasswordLink)(email, "User");
                if (!isMailSended) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Email not sent");
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.validateToken = async (token) => {
            try {
                const { email, role } = (0, jwt_config_1.verifyResetPasswordToken)(token);
                if (!email || !role) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Token has expired or is invalid.");
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.confirmResetPassword = async (token, password) => {
            try {
                const { email, role } = (0, jwt_config_1.verifyResetPasswordToken)(token);
                if (!email) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Token has expired or is invalid");
                }
                if (role !== "User") {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NoAccess, "Unauthorized role. You must be a User to reset your password.");
                }
                await this.userRepository.confirmResetPassword(email, password);
            }
            catch (error) {
                throw error;
            }
        };
        this.updateUser = async (user_id, user) => {
            try {
                return await this.userRepository.updateUser(user_id, user);
            }
            catch (error) {
                throw error;
            }
        };
        this.profilePicture = async (user_id, filePath) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "User not found");
                }
                // Delete old profile image from local storage if exists
                if (userData.profileImage) {
                    const imagePath = path_1.default.join(__dirname, "../uploads", userData.profileImage);
                    try {
                        if (fs_1.default.existsSync(imagePath)) {
                            await fs_1.promises.unlink(imagePath);
                            console.log("Old profile image deleted");
                        }
                    }
                    catch (error) {
                        console.error("Failed to delete old profile image:", error);
                    }
                }
                const result = await cloudinary_config_1.default.uploader.upload(filePath, {
                    folder: "uploads",
                });
                try {
                    await fs_1.promises.unlink(filePath);
                }
                catch (error) {
                    console.warn("Failed to delete local temp image file:", error);
                }
                const profileURL = result.secure_url;
                const user = await this.userRepository.profilePicture(user_id, profileURL);
                if (!user) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Profile Image has not been updated");
                }
                return user.profileImage;
            }
            catch (error) {
                throw error;
            }
        };
        this.addRefferalCode = async (user_id, refferalCode) => {
            try {
                const companyData = await this.companyRepository.companyDetailsByRefferal(refferalCode);
                if (!companyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Your Refferal Code is wrong. Please enter the correct Refferal Code");
                }
                const companyId = companyData._id;
                const userData = await this.userRepository.addRefferalCodeToUser(user_id, refferalCode, companyId);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "User not found");
                }
                const email = userData.email;
                const updatedCompanyData = await this.companyRepository.updateJoinedStatus(email);
                if (!updatedCompanyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company exists");
                }
                const userWithoutId = await this.userRepository.userWithoutId(user_id);
                return userWithoutId;
            }
            catch (error) {
                throw error;
            }
        };
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }
}
exports.default = UserServices;
