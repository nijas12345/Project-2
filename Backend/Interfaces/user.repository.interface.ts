import { Types } from "mongoose";
import { IUser } from "./commonInterface";

export interface IUserRepository{
    findByEmail(email:string):Promise<IUser|null>;
    findByUserId(user_id:string):Promise<IUser|null>
    register(userData:IUser):Promise<IUser>
    login(email:string):Promise<IUser|null>
    verifyGoogleAuth(email:string):Promise<IUser|null>
    createUser(email:string,user_id:string):Promise<IUser>
    resetPassword(email:string):Promise<IUser|null>
    userBlock(user_id:string):Promise<IUser|null>
    userUnBlock(user_id:string):Promise<IUser|null>
    confirmResetPassword(email:string,password:string):Promise<void>
    updateUser(user_id:string,user:IUser):Promise<IUser|null> 
    profilePicture(user_id:string,profileURL:string):Promise<IUser|null> 
    addRefferalCodeToUser(user_id:string,refferalCode:string,compnayId:Types.ObjectId):Promise<IUser|null>
    userWithoutId(user_id:string):Promise<IUser|null>
    searchProjectMembers(memberEmails:string[],searchQuery:string):Promise<IUser[]>
    countUserDocuments(companyId:string):Promise<number>
    existingUsers(refferalCode:string,memberEmails:string[]):Promise<IUser[]>
    findUsers(memberEmails:string[]):Promise<IUser[]>
}