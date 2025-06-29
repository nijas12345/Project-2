import { AdminDoc } from "../Model/adminModal";
import { Types } from "mongoose";
export interface IAdminRepository{
    findByEmail(email:string):Promise<AdminDoc|null>;
    register(adminData:AdminDoc):Promise<AdminDoc>
    login(email:string):Promise<AdminDoc|null>
    verifyGoogleAuth(email:string):Promise<AdminDoc|null>
    createAdmin(email:string,admin_id:string):Promise<AdminDoc>
    resetPassword(email:string):Promise<AdminDoc|null>
    confirmResetPassword(email:string,password:string):Promise<void>
    findByAdminId(admin_id:string):Promise<AdminDoc|null>
    updateProfileImage(admin_id:string,profileURL:string):Promise<AdminDoc|null>
    updateAdmin(admin_id:string,admin:AdminDoc):Promise<AdminDoc|null>
    updateCompanyDetails(companyId:Types.ObjectId,admin_id:string):Promise<AdminDoc|null>
}