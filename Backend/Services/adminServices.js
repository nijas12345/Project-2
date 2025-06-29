"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const email_config_1 = require("../Config/email_config");
const jwt_config_1 = require("../Config/jwt_config");
const google_auth_library_1 = require("google-auth-library");
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const cloudinary_config_1 = __importDefault(require("../Config/cloudinary_config"));
const client = new google_auth_library_1.OAuth2Client(`${process.env.Google_clientID}`);
class AdminServices {
    constructor(adminRepository, userRepository) {
        this.adminData = null;
        this.otp = null;
        this.expiryOTP_time = null;
        this.login = async (email, password) => {
            try {
                const adminData = await this.adminRepository.login(email);
                if (!adminData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Email not found");
                }
                if (!adminData.password) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Please login through Google");
                }
                const comparePassword = await bcrypt_1.default.compare(password, adminData.password);
                if (!comparePassword) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Wrong password");
                }
                const adminToken = (0, jwt_config_1.createToken)(adminData.admin_id, "ADMIN");
                const adminRefreshToken = (0, jwt_config_1.createRefreshToken)(adminData.admin_id, "ADMIN");
                return { adminToken, adminRefreshToken, adminData };
            }
            catch (error) {
                throw error;
            }
        };
        this.register = async (adminData) => {
            try {
                const alreadyExists = await this.adminRepository.findByEmail(adminData.email);
                if (alreadyExists) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Conflict, "Email already exists");
                }
                this.adminData = adminData;
                const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
                this.otp = generatedOtp;
                console.log(`generatedOTp${generatedOtp}`);
                const isMailSended = await (0, email_config_1.sendOTPmail)(adminData.email, generatedOtp);
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
                if (!this.adminData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin data not found");
                }
                if (enteredOTP !== this.otp) {
                    throw new HttpError_1.HttpError(400, "Incorrect OTP"); // Bad Request
                }
                const currentTime = new Date();
                if (currentTime > this.expiryOTP_time) {
                    throw new HttpError_1.HttpError(401, "OTP is expired"); // Unauthorized (session expired)
                }
                console.log(enteredOTP);
                const hashedPassword = await bcrypt_1.default.hash(this.adminData.password, 10);
                this.adminData.password = hashedPassword;
                this.adminData.admin_id = (0, uuid_1.v4)();
                const response = await this.adminRepository.register(this.adminData);
                this.otp = null;
                this.adminData = null;
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
                const isMailSended = await (0, email_config_1.sendOTPmail)(this.adminData.email, Generated_OTP);
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
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Invalid Google token or email not found in payload");
                }
                let adminData = await this.adminRepository.verifyGoogleAuth(payload.email);
                if (!adminData) {
                    const admin_id = (0, uuid_1.v4)();
                    adminData = await this.adminRepository.createAdmin(payload.email, admin_id);
                }
                const adminToken = (0, jwt_config_1.createToken)(adminData.admin_id, "ADMIN");
                const adminRefreshToken = (0, jwt_config_1.createRefreshToken)(adminData.admin_id, "ADMIN");
                // Return admin data along with tokens
                return { adminData, adminToken, adminRefreshToken };
            }
            catch (error) {
                console.error("Error verifying Google authentication:", error);
                throw error;
            }
        };
        this.resetPassword = async (email) => {
            try {
                const adminData = await this.adminRepository.resetPassword(email);
                console.log("adminData", adminData);
                if (!adminData)
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Sorry! You have no account in Project-X. Please create an account");
                const isMailSended = await (0, email_config_1.sendResetPasswordLink)(email, "Admin");
                if (!isMailSended) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Email not sent. Please try again later.");
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
                console.log("isValid", email);
                if (!email) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Unauthorized, "Token has expired or is invalid");
                }
                if (role !== "Admin") {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NoAccess, // 403
                    "Unauthorized role. You must be a User to reset your password.");
                }
                await this.adminRepository.confirmResetPassword(email, password);
            }
            catch (error) {
                throw error;
            }
        };
        this.userBlock = async (user_id) => {
            try {
                const userData = await this.userRepository.userBlock(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, // 404
                    "No user data found");
                }
                return userData;
            }
            catch (error) {
                throw error;
            }
        };
        this.userUnBlock = async (user_id) => {
            try {
                const userData = await this.userRepository.userUnBlock(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, // 404
                    "No user data found");
                }
                return userData;
            }
            catch (error) {
                throw error;
            }
        };
        this.updateAdmin = async (admin_id, admin) => {
            try {
                return await this.adminRepository.updateAdmin(admin_id, admin);
            }
            catch (error) {
                throw error;
            }
        };
        this.adminProfilePicture = async (admin_id, file) => {
            try {
                const admin = await this.adminRepository.findByAdminId(admin_id);
                if (!admin) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin not found");
                }
                // Upload to Cloudinary
                const result = await cloudinary_config_1.default.uploader.upload(file.path, {
                    folder: "uploads"
                });
                // Delete local file
                await promises_1.default.unlink(file.path);
                console.log("Local file deleted successfully");
                // Delete old image if exists
                if (admin.profileImage) {
                    const oldImagePath = path_1.default.join(__dirname, "../uploads", admin.profileImage);
                    if (fs_1.default.existsSync(oldImagePath)) {
                        await promises_1.default.unlink(oldImagePath);
                        console.log("Old profile image deleted");
                    }
                }
                const updatedAdmin = await this.adminRepository.updateProfileImage(admin_id, result.secure_url);
                if (!updatedAdmin) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Failed to update admin profile picture");
                }
                return updatedAdmin.profileImage;
            }
            catch (error) {
                throw error;
            }
        };
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }
}
exports.default = AdminServices;
