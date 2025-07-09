import { AdminDoc } from "../Model/adminModal";
import { Types } from "mongoose";

//  Authentication-related methods
export interface IAdminAuthRepository {
  findByEmail(email: string): Promise<AdminDoc | null>;
  register(adminData: AdminDoc): Promise<AdminDoc>;
  login(email: string): Promise<AdminDoc | null>;
  verifyGoogleAuth(email: string): Promise<AdminDoc | null>;
  createAdmin(email: string, admin_id: string): Promise<AdminDoc>;
}

//  Password-reset-related methods
export interface IAdminPasswordRepository {
  resetPassword(email: string): Promise<AdminDoc | null>;
  confirmResetPassword(email: string, password: string): Promise<void>;
}

//  Profile-related methods
export interface IAdminProfileRepository {
  findByAdminId(admin_id: string): Promise<AdminDoc | null>;
  updateProfileImage(admin_id: string, profileURL: string): Promise<AdminDoc | null>;
  updateAdmin(admin_id: string, admin: AdminDoc): Promise<AdminDoc | null>;
}

//  Company-related methods
export interface IAdminCompanyRepository {
  updateCompanyDetails(companyId: Types.ObjectId, admin_id: string): Promise<AdminDoc | null>;
}

// 🔹 Combined Interface
export interface IAdminRepository
  extends IAdminAuthRepository,
          IAdminPasswordRepository,
          IAdminProfileRepository,
          IAdminCompanyRepository {}
