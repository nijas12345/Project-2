import { Request, Response } from "express";
import { IAdminService } from "../Interfaces/admin.service.interface";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { AdminDoc } from "../Model/adminModal";
import dotenv from "dotenv";
dotenv.config();
import { HttpError } from "../Utils/HttpError";
import { handleError } from "../Utils/handleError";
class AdminController {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  // Admin Registration
  register = async (req: Request, res: Response) => {
    try {
      const adminData = req.body;
      await this.adminService.register(adminData);

      res
        .status(HTTP_statusCode.OK)
        .send("Admin registered successfully and OTP sent to email");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  // OTP Verification
  otpVerification = async (req: Request, res: Response) => {
    try {
      const enteredOTP: string = req.body.otp;
      console.log(enteredOTP);

      const serviceResponse = await this.adminService.otpVerification(
        enteredOTP
      );
      console.log(serviceResponse);
      res.status(HTTP_statusCode.OK).send(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  // Resend OTP
  resendOTP = async (req: Request, res: Response) => {
    try {
      await this.adminService.resendOTP();
      res.status(HTTP_statusCode.OK).send("OTP sent again");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  // Admin Login
  login = async (req: Request, res: Response) => {
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

      res.status(HTTP_statusCode.OK).json(serviceResponse.adminData);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  // Verify Google Authentication for Admin
  verifyGoogleAuth = async (req: Request, res: Response) => {
    try {
      const token: string = req.body.token as string;
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

      res.status(HTTP_statusCode.OK).json(serviceResponse.adminData);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  resetPassword = async (req: Request, res: Response) => {
    try {
      const email: string = req.body.email;
      await this.adminService.resetPassword(email);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  validateToken = async (req: Request, res: Response) => {
    try {
      const token = req.body.token;
      await this.adminService.validateToken(token);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  confirmResetPassword = async (req: Request, res: Response) => {
    try {
      const token = req.body.token as string;
      const password = req.body.passord as string;
      await this.adminService.confirmResetPassword(token, password);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("AdminAccessToken", {
        httpOnly: true,
      });
      res.clearCookie("AdminRefreshToken", {
        httpOnly: true,
      });
      res.status(HTTP_statusCode.OK).send("Logged out successfully");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  blockUser = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      const serviceResponse = await this.adminService.userBlock(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  unBlockUser = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;
      const serviceResponse = await this.adminService.userUnBlock(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  updateAdmin = async (req: Request, res: Response) => {
    try {
      const admin_id: string = req.admin_id as string;
      const admin: AdminDoc = req.body;
      const serviceResponse = await this.adminService.updateAdmin(
        admin_id,
        admin
      );
      console.log(serviceResponse);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  adminProfilePicture = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const file = req.file;

      if (!file)
        throw new HttpError(HTTP_statusCode.BadRequest, "No file provided");

      const profileURL = await this.adminService.adminProfilePicture(
        admin_id,
        file
      );

      res.status(HTTP_statusCode.OK).json(profileURL);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}

export default AdminController;
