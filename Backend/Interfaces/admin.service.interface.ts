import { AdminDoc } from "../Model/adminModal";
import { UserDoc } from "../Model/userModal";
export interface IAdminService {
    login(email:string,password:string):Promise<{adminData:AdminDoc,adminToken:string,adminRefreshToken:string}>
    register(adminData:AdminDoc):Promise<void>;
    otpVerification(enteredOTP:string):Promise<AdminDoc>
    resendOTP():Promise<void>
    verifyGoogleAuth(token: string): Promise<{adminData:AdminDoc,adminToken:string,adminRefreshToken:string}>;
    resetPassword(email:string):Promise<void>
    confirmResetPassword(token:string,password:string):Promise<void>
    validateToken(token:string):Promise<void>
    userBlock(user_id:string):Promise<UserDoc>
    userUnBlock(user_id:string):Promise<UserDoc>
    updateAdmin(admin_id:string,admin:AdminDoc):Promise<AdminDoc|null>
    adminProfilePicture(admin_id:string,file:Express.Multer.File):Promise<string>
}