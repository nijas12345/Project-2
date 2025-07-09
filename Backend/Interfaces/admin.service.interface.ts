import { AdminDoc } from "../Model/adminModal";
import { UserDoc } from "../Model/userModal";

// Auth-related service methods
export interface IAdminAuthService {
  login(email: string, password: string): Promise<{
    adminData: AdminDoc;
    adminToken: string;
    adminRefreshToken: string;
  }>;
  register(adminData: AdminDoc): Promise<void>;
  otpVerification(enteredOTP: string): Promise<AdminDoc>;
  resendOTP(): Promise<void>;
  verifyGoogleAuth(token: string): Promise<{
    adminData: AdminDoc;
    adminToken: string;
    adminRefreshToken: string;
  }>;
}

//  Password & token-related service methods
export interface IAdminSecurityService {
  resetPassword(email: string): Promise<void>;
  confirmResetPassword(token: string, password: string): Promise<void>;
  validateToken(token: string): Promise<void>;
}

//  User control methods
export interface IAdminUserControlService {
  userBlock(user_id: string): Promise<UserDoc>;
  userUnBlock(user_id: string): Promise<UserDoc>;
}

//  Admin profile methods
export interface IAdminProfileService {
  updateAdmin(admin_id: string, admin: AdminDoc): Promise<AdminDoc | null>;
  adminProfilePicture(admin_id: string, file: Express.Multer.File): Promise<string>;
}

//  Final combined interface for full AdminService
export interface IAdminService
  extends IAdminAuthService,
          IAdminSecurityService,
          IAdminUserControlService,
          IAdminProfileService {}
