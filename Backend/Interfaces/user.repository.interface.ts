import { Types } from "mongoose";
import { UserDoc, UserInput } from "../Model/userModal";

export interface IUserRepository{
    findByEmail(email:string):Promise<UserDoc|null>;
    findByUserId(user_id:string):Promise<UserDoc|null>
    register(userData:UserInput):Promise<UserDoc>
    login(email:string):Promise<UserDoc|null>
    verifyGoogleAuth(email:string):Promise<UserDoc|null>
    createUser(email:string,user_id:string):Promise<UserDoc>
    resetPassword(email:string):Promise<UserDoc|null>
    userBlock(user_id:string):Promise<UserDoc|null>
    userUnBlock(user_id:string):Promise<UserDoc|null>
    confirmResetPassword(email:string,password:string):Promise<void>
    updateUser(user_id:string,user:UserDoc):Promise<UserDoc|null> 
    profilePicture(user_id:string,profileURL:string):Promise<UserDoc|null> 
    addRefferalCodeToUser(user_id:string,refferalCode:string,compnayId:Types.ObjectId):Promise<UserDoc|null>
    userWithoutId(user_id:string):Promise<UserDoc|null>
    searchProjectMembers(memberEmails:string[],searchQuery:string):Promise<UserDoc[]>
    countUserDocuments(companyId:string):Promise<number>
    existingUsers(refferalCode:string,memberEmails:string[]):Promise<UserDoc[]>
    findUsers(memberEmails:string[]):Promise<UserDoc[]>
}