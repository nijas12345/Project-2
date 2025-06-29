import { UserDoc } from "../Model/userModal";
export interface IUserService {
    login(email:string,password:string):Promise<{userData:UserDoc,userToken:string,refreshToken:string}>
    register(userData:UserDoc):Promise<void>;
    otpVerification(enteredOTP:string):Promise<UserDoc>
    resendOTP():Promise<void>
    verifyGoogleAuth(token: string): Promise<{userData:UserDoc,userToken:string,refreshToken:string}>;
    resetPassword(email:string):Promise<void>
    confirmResetPassword(token:string,password:string):Promise<void>
    validateToken(token:string):Promise<void>
    updateUser(user_id:string,user:UserDoc):Promise<UserDoc|null>
    profilePicture(user_id:string,filePath:string):Promise<string>
    addRefferalCode(user_id:string,refferalCode:string):Promise<UserDoc|null>
}