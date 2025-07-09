import { Types } from "mongoose";
import { UserDoc, UserInput } from "../Model/userModal";

//  Auth-related methods
export interface IUserAuthRepository {
  findByEmail(email: string): Promise<UserDoc | null>;
  login(email: string): Promise<UserDoc | null>;
  verifyGoogleAuth(email: string): Promise<UserDoc | null>;
  createUser(email: string, user_id: string): Promise<UserDoc>;
}

//  Profile & account management
export interface IUserProfileRepository {
  register(userData: UserInput): Promise<UserDoc>;
  updateUser(user_id: string, user: UserDoc): Promise<UserDoc | null>;
  profilePicture(user_id: string, profileURL: string): Promise<UserDoc | null>;
  userWithoutId(user_id: string): Promise<UserDoc | null>;
  findByUserId(user_id: string): Promise<UserDoc | null>; // ✅ placed here
}

//  Password management
export interface IUserPasswordRepository {
  resetPassword(email: string): Promise<UserDoc | null>;
  confirmResetPassword(email: string, password: string): Promise<void>;
}

//  User moderation
export interface IUserModerationRepository {
  userBlock(user_id: string): Promise<UserDoc | null>;
  userUnBlock(user_id: string): Promise<UserDoc | null>;
}

//  Business logic
export interface IUserBusinessRepository {
  addRefferalCodeToUser(
    user_id: string,
    refferalCode: string,
    compnayId: Types.ObjectId
  ): Promise<UserDoc | null>;
  existingUsers(refferalCode: string, memberEmails: string[]): Promise<UserDoc[]>;
  findUsers(memberEmails: string[]): Promise<UserDoc[]>;
}

//  Search & analytics
export interface IUserAnalyticsRepository {
  searchProjectMembers(memberEmails: string[], searchQuery: string): Promise<UserDoc[]>;
  countUserDocuments(companyId: string): Promise<number>;
}

//  Final combined interface
export interface IUserRepository
  extends IUserAuthRepository,
          IUserProfileRepository,
          IUserPasswordRepository,
          IUserModerationRepository,
          IUserBusinessRepository,
          IUserAnalyticsRepository {}
