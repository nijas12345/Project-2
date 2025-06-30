import { IUserService } from "../Interfaces/user.service.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendOTPmail, sendResetPasswordLink } from "../Config/email_config";
import {
  createToken,
  createRefreshToken,
  verifyResetPasswordToken,
} from "../Config/jwt_config";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../Config/cloudinary_config";
import { ICompanyRepository } from "../Interfaces/company.repository.interface";
import path from "path";
import fs, { promises as fsPromises } from "fs";
import { Types } from "mongoose";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { UserDoc } from "../Model/userModal";
import { CompanyDoc } from "../Model/companyModal";

const client = new OAuth2Client(`${process.env.Google_clientID}`);
class UserServices implements IUserService {
  private userRepository: IUserRepository;
  private companyRepository: ICompanyRepository;
  private userData: UserDoc | null = null;
  private otp: string | null = null;
  private expiryOTP_time: Date | null = null;
  constructor(
    userRepository: IUserRepository,
    companyRepository: ICompanyRepository
  ) {
    this.userRepository = userRepository;
    this.companyRepository = companyRepository;
  }
  login = async (
    email: string,
    password: string
  ): Promise<{ userData: UserDoc; userToken: string; refreshToken: string }> => {
    try {
      const userData = await this.userRepository.login(email);
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Email not found");
      }

      if (!userData.password) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Please login through Google"
        );
      }
      const comparePassword = await bcrypt.compare(
        password,
        userData.password as string
      );
      if (!comparePassword) {
        throw new HttpError(HTTP_statusCode.Unauthorized, "Wrong password");
      }

      if (userData.isBlocked) {
        throw new HttpError(HTTP_statusCode.NoAccess, "User is blocked");
      }
      const userToken = createToken(userData.user_id as string, "USER");
      const refreshToken = createRefreshToken(
        userData.user_id as string,
        "USER"
      );
      return { userToken, refreshToken, userData };
    } catch (error: unknown) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  register = async (userData: UserDoc): Promise<void> => {
    try {
      const alreadyExists: UserDoc | null = await this.userRepository.findByEmail(
        userData.email
      );
      
      if (alreadyExists) {
        throw new HttpError(HTTP_statusCode.Conflict, "Email already exists");
      }
      this.userData = userData;
      const generatedOtp: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.otp = generatedOtp;
      console.log(`generatedOTp${generatedOtp}`);
      const isMailSended = await sendOTPmail(userData.email, generatedOtp);
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
  otpVerification = async (enteredOTP: string): Promise<UserDoc> => {
    try {
      if (!this.userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "User data not found");
      }

      if (enteredOTP !== this.otp) {
        throw new HttpError(HTTP_statusCode.Unauthorized, "Incorrect OTP");
      }

      const currentTime = new Date();
      if (currentTime > this.expiryOTP_time!) {
        throw new HttpError(HTTP_statusCode.Expired, "OTP is expired");
      }
      console.log(enteredOTP);

      const hashedPassword = await bcrypt.hash(
        this.userData.password as string,
        10
      );
      this.userData.password = hashedPassword;
      this.userData!.user_id = uuidv4();
      if (this.userData.refferalCode) {
        const refferalCode: string = this.userData.refferalCode;
        const email: string = this.userData.email;
        const companyData: CompanyDoc | null =
          await this.companyRepository.updateCompanyRefferal(
            refferalCode,
            email
          );
        if (!companyData) {
          throw new HttpError(HTTP_statusCode.NotFound, "No company exist");
        }
      }
      const response: UserDoc = await this.userRepository.register(this.userData);
      this.otp = null;
      this.userData = null;
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
        this.userData!.email,
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
  ): Promise<{ userData: UserDoc; userToken: string; refreshToken: string }> => {
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
          HTTP_statusCode.Unauthorized,
          "Invalid Google token or email not found in payload"
        );
      }
      let userData: UserDoc | null = await this.userRepository.verifyGoogleAuth(
        payload.email
      );
      if (!userData) {
        let user_id = uuidv4();
        userData = await this.userRepository.createUser(payload.email, user_id);
      }

      if (userData.isBlocked) {
        throw new HttpError(
          HTTP_statusCode.NoAccess, // 403
          "User is blocked"
        );
      }
      // Generate access and refresh tokens
      const userToken = createToken(userData.user_id as string, "USER");
      const refreshToken = createRefreshToken(
        userData.user_id as string,
        "USER"
      );

      return { userData, userToken, refreshToken };
    } catch (error: unknown) {
      console.error("Error verifying Google authentication:", error);
      throw error;
    }
  };
  resetPassword = async (email: string): Promise<void> => {
    try {
      const userData: UserDoc | null = await this.userRepository.resetPassword(
        email
      );
      if (!userData) {
        throw new HttpError(
          HTTP_statusCode.NotFound, // 404
          "Sorry! You have no account in Projec-X. Please create an account"
        );
      }
      const isMailSended = await sendResetPasswordLink(email, "User");

      if (!isMailSended) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError,
          "Email not sent"
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
      if (!email) {
        throw new HttpError(
          HTTP_statusCode.Unauthorized,
          "Token has expired or is invalid"
        );
      }

      if (role !== "User") {
        throw new HttpError(
          HTTP_statusCode.NoAccess,
          "Unauthorized role. You must be a User to reset your password."
        );
      }
      await this.userRepository.confirmResetPassword(email, password);
    } catch (error: unknown) {
      throw error;
    }
  };
  updateUser = async (user_id: string, user: UserDoc): Promise<UserDoc | null> => {
    try {
      return await this.userRepository.updateUser(user_id, user);
    } catch (error: unknown) {
      throw error;
    }
  };
  profilePicture = async (
    user_id: string,
    filePath: string
  ): Promise<string> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "User not found");
      }

      // Delete old profile image from local storage if exists
      if (userData.profileImage) {
        const imagePath = path.join(
          __dirname,
          "../uploads",
          userData.profileImage
        );
        try {
          if (fs.existsSync(imagePath)) {
            await fsPromises.unlink(imagePath);
            console.log("Old profile image deleted");
          }
        } catch (error: unknown) {
          console.error("Failed to delete old profile image:", error);
        }
      }

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "uploads",
      });

      try {
        await fsPromises.unlink(filePath);
      } catch (error: unknown) {
        console.warn("Failed to delete local temp image file:", error);
      }

      const profileURL = result.secure_url;
      const user: UserDoc | null = await this.userRepository.profilePicture(
        user_id,
        profileURL
      );
      if (!user) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Profile Image has not been updated"
        );
      }
      return user.profileImage;
    } catch (error: unknown) {
      throw error;
    }
  };

  addRefferalCode = async (
    user_id: string,
    refferalCode: string
  ): Promise<UserDoc | null> => {
    try {
      const companyData: CompanyDoc | null =
        await this.companyRepository.companyDetailsByRefferal(refferalCode);
      if (!companyData) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Your Refferal Code is wrong. Please enter the correct Refferal Code"
        );
      }
      const companyId: Types.ObjectId = companyData._id;
      const userData: UserDoc | null =
        await this.userRepository.addRefferalCodeToUser(
          user_id,
          refferalCode,
          companyId
        );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "User not found");
      }
      const email: string = userData.email;
      const updatedCompanyData: CompanyDoc | null =
        await this.companyRepository.updateJoinedStatus(email);
      if (!updatedCompanyData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No company exists");
      }
      const userWithoutId: UserDoc | null =
        await this.userRepository.userWithoutId(user_id);
      return userWithoutId;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default UserServices;
