import { UserDoc } from "../Model/userModal";

//  Authentication
export interface IUserAuthService {
  login(email: string, password: string): Promise<{
    userData: UserDoc;
    userToken: string;
    refreshToken: string;
  }>;
  verifyGoogleAuth(token: string): Promise<{
    userData: UserDoc;
    userToken: string;
    refreshToken: string;
  }>;
}

//  Registration & OTP
export interface IUserRegistrationService {
  register(userData: UserDoc): Promise<void>;
  otpVerification(enteredOTP: string): Promise<UserDoc>;
  resendOTP(): Promise<void>;
}

//  Password Reset
export interface IUserPasswordService {
  resetPassword(email: string): Promise<void>;
  confirmResetPassword(token: string, password: string): Promise<void>;
  validateToken(token: string): Promise<void>;
}

//  Profile Management
export interface IUserProfileService {
  updateUser(user_id: string, user: UserDoc): Promise<UserDoc | null>;
  profilePicture(user_id: string, filePath: string): Promise<string>;
}

//  Referral / Business Logic
export interface IUserReferralService {
  addRefferalCode(user_id: string, refferalCode: string): Promise<UserDoc | null>;
}

//  Optional: Unified Service
export interface IUserService
  extends IUserAuthService,
          IUserRegistrationService,
          IUserPasswordService,
          IUserProfileService,
          IUserReferralService {}
