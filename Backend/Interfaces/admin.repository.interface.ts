import { IAdmin } from "./commonInterface";
import { Types } from "mongoose";
export interface IAdminRepository{
    findByEmail(email:string):Promise<IAdmin|null>;
    register(adminData:IAdmin):Promise<IAdmin>
    login(email:string):Promise<IAdmin|null>
    verifyGoogleAuth(email:string):Promise<IAdmin|null>
    createAdmin(email:string,admin_id:string):Promise<IAdmin>
    resetPassword(email:string):Promise<IAdmin|null>
    confirmResetPassword(email:string,password:string):Promise<void>
    findByAdminId(admin_id:string):Promise<IAdmin|null>
    updateProfileImage(admin_id:string,profileURL:string):Promise<IAdmin|null>
    updateAdmin(admin_id:string,admin:IAdmin):Promise<IAdmin|null>
    updateCompanyDetails(companyId:Types.ObjectId,admin_id:string):Promise<IAdmin|null>
}