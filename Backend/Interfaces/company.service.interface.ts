import { AdminDoc } from "../Model/adminModal";
import { CompanyInput, CompanyMemberDoc, CompanyMemberInput } from "../Model/companyModal";
import { UserDoc } from "../Model/userModal";
import { MemberInput, ProjectDoc } from "../Model/projectModal";

export interface ICompanyService{
  companyDetails(companyData:CompanyInput,user_id:string):Promise<AdminDoc>
  companyMembers(admin_id:string):Promise<CompanyMemberDoc[]>
  companyData(admin_id:string):Promise<string>
  inviationUsers(admin_id:string,members:MemberInput[]):Promise<CompanyMemberDoc[]>
  inviteUser(admin_id:string,email:string):Promise<void>
  companyInfo(admin_id:string):Promise<{companyName:string,userCount:number,projectCount:number,premium:string}>
  companyName(user_id:string):Promise<string>
  searchMembers(admin_id:string,searchQuery:string,selectedProject:ProjectDoc|null):Promise<CompanyMemberDoc[]|UserDoc[]>
}


