import { AdminDoc } from "../Model/adminModal";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { sendOTPmail, sendResetPasswordLink } from "../Config/email_config";
import {
  createToken,
  createRefreshToken,
  verifyResetPasswordToken,
} from "../Config/jwt_config";
import { OAuth2Client } from "google-auth-library";
import { IAdminService } from "../Interfaces/admin.service.interface";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import cloudinary from "../Config/cloudinary_config";
import { UserDoc } from "../Model/userModal";

const client = new OAuth2Client(`${process.env.Google_clientID}`);
class AdminServices implements IAdminService {
  private adminRepository: IAdminRepository;
  private userRepository: IUserRepository;
  private adminData: AdminDoc | null = null;
  private otp: string | null = null;
  private expiryOTP_time: Date | null = null;
  constructor(
    adminRepository: IAdminRepository,
    userRepository: IUserRepository
  ) {
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
  }
  login = async (
    email: string,
    password: string
  ): Promise<{
    adminData: AdminDoc;
    adminToken: string;
    adminRefreshToken: string;
  }> => {
    try {
      const adminData = await this.adminRepository.login(email);
      if (!adminData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Email not found");
      }

      if (!adminData.password) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Please login through Google"
        );
      }
      const comparePassword = await bcrypt.compare(
        password,
        adminData.password as string
      );
      if (!comparePassword) {
        throw new HttpError(HTTP_statusCode.Unauthorized, "Wrong password");
      }

      const adminToken = createToken(adminData.admin_id as string, "ADMIN");
      const adminRefreshToken = createRefreshToken(
        adminData.admin_id as string,
        "ADMIN"
      );

      return { adminToken, adminRefreshToken, adminData };
    } catch (error: unknown) {
      throw error;
    }
  };

  register = async (adminData: AdminDoc): Promise<void> => {
    try {
      const alreadyExists: AdminDoc | null =
        await this.adminRepository.findByEmail(adminData.email);
      if (alreadyExists) {
        throw new HttpError(HTTP_statusCode.Conflict, "Email already exists");
      }
      this.adminData = adminData;

      const generatedOtp: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.otp = generatedOtp;
      console.log(`generatedOTp${generatedOtp}`);
      const isMailSended = await sendOTPmail(adminData.email, generatedOtp);
      if (!isMailSended) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError,
          "Email not sent"
        );
      }
      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
      return;
    } catch (error: unknown) {
      throw error;
    }
  };
  otpVerification = async (enteredOTP: string): Promise<AdminDoc> => {
    try {
      if (!this.adminData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin data not found");
      }

      if (enteredOTP !== this.otp) {
        throw new HttpError(400, "Incorrect OTP"); // Bad Request
      }

      const currentTime = new Date();
      if (currentTime > this.expiryOTP_time!) {
        throw new HttpError(401, "OTP is expired"); // Unauthorized (session expired)
      }
      console.log(enteredOTP);

      const hashedPassword = await bcrypt.hash(
        this.adminData.password as string,
        10
      );
      this.adminData.password = hashedPassword;
      this.adminData!.admin_id = uuidv4();
      const response: AdminDoc = await this.adminRepository.register(
        this.adminData
      );

      this.otp = null;
      this.adminData = null;

      return response;
    } catch (error: unknown) {
      throw error;
    }
  };
  resendOTP = async (): Promise<void> => {
    try {
      const Generated_OTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.otp = Generated_OTP;
      console.log(`Regenearted OTP : ${Generated_OTP}`);
      const isMailSended = await sendOTPmail(
        this.adminData!.email,
        Generated_OTP
      );
      if (!isMailSended) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError,
          "Email not sent"
        );
      }
      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
      return;
    } catch (error: unknown) {
      throw error;
    }
  };
  verifyGoogleAuth = async (
    token: string
  ): Promise<{
    adminData: AdminDoc;
    adminToken: string;
    adminRefreshToken: string;
  }> => {
    try {
      // Attempt to verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.Google_clientID as string,
      });

      // Get payload and validate it exists
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Invalid Google token or email not found in payload"
        );
      }

      let adminData: AdminDoc | null =
        await this.adminRepository.verifyGoogleAuth(payload.email);
      if (!adminData) {
        const admin_id = uuidv4();
        adminData = await this.adminRepository.createAdmin(
          payload.email,
          admin_id
        );
      }
      const adminToken = createToken(adminData.admin_id as string, "ADMIN");
      const adminRefreshToken = createRefreshToken(
        adminData.admin_id as string,
        "ADMIN"
      );

      // Return admin data along with tokens
      return { adminData, adminToken, adminRefreshToken };
    } catch (error: unknown) {
      console.error("Error verifying Google authentication:", error);
      throw error;
    }
  };
  resetPassword = async (email: string): Promise<void> => {
    try {
      const adminData: AdminDoc | null = await this.adminRepository.resetPassword(
        email
      );
      console.log("adminData", adminData);
      if (!adminData)
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Sorry! You have no account in Project-X. Please create an account"
        );
      const isMailSended = await sendResetPasswordLink(email, "Admin");
      if (!isMailSended) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError,
          "Email not sent. Please try again later."
        );
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  validateToken = async (token: string): Promise<void> => {
    try {
      const { email, role } = verifyResetPasswordToken(token);
      if (!email || !role) {
        throw new HttpError(
          HTTP_statusCode.Unauthorized,
          "Token has expired or is invalid."
        );
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  confirmResetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    try {
      const { email, role } = verifyResetPasswordToken(token);
      console.log("isValid", email);
      if (!email) {
        throw new HttpError(
          HTTP_statusCode.Unauthorized,
          "Token has expired or is invalid"
        );
      }

      if (role !== "Admin") {
        throw new HttpError(
          HTTP_statusCode.NoAccess, // 403
          "Unauthorized role. You must be a User to reset your password."
        );
      }
      await this.adminRepository.confirmResetPassword(email, password);
    } catch (error: unknown) {
      throw error;
    }
  };
  userBlock = async (user_id: string): Promise<UserDoc> => {
    try {
      const userData = await this.userRepository.userBlock(user_id);
      if (!userData) {
        throw new HttpError(
          HTTP_statusCode.NotFound, // 404
          "No user data found"
        );
      }
      return userData;
    } catch (error: unknown) {
      throw error;
    }
  };
  userUnBlock = async (user_id: string): Promise<UserDoc> => {
    try {
      const userData = await this.userRepository.userUnBlock(user_id);
      if (!userData) {
        throw new HttpError(
          HTTP_statusCode.NotFound, // 404
          "No user data found"
        );
      }
      return userData;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateAdmin = async (
    admin_id: string,
    admin: AdminDoc
  ): Promise<AdminDoc | null> => {
    try {
      return await this.adminRepository.updateAdmin(admin_id, admin);
    } catch (error: unknown) {
      throw error;
    }
  };
adminProfilePicture = async (
  admin_id: string,
  file: Express.Multer.File
): Promise<string> => {
  try {
    const admin = await this.adminRepository.findByAdminId(admin_id);
    if (!admin) {
      throw new HttpError(HTTP_statusCode.NotFound, "Admin not found");
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads"
    });

    // Delete local file
    await fsPromises.unlink(file.path);
    console.log("Local file deleted successfully");

    // Delete old image if exists
    if (admin.profileImage) {
      const oldImagePath = path.join(__dirname, "../uploads", admin.profileImage);
      if (fs.existsSync(oldImagePath)) {
        await fsPromises.unlink(oldImagePath);
        console.log("Old profile image deleted");
      }
    }

    const updatedAdmin = await this.adminRepository.updateProfileImage(admin_id, result.secure_url);

    if (!updatedAdmin) {
      throw new HttpError(HTTP_statusCode.InternalServerError, "Failed to update admin profile picture");
    }

    return updatedAdmin.profileImage;
  } catch (error:unknown) {
    throw error;
  }
};

}

export default AdminServices;
