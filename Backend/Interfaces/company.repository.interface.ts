import { CompanyDoc, CompanyInput } from "../Model/companyModal";
import { IMember } from "./commonInterface";

export interface ICompanyRepository{
  existCompanyData(companyName:string):Promise<CompanyDoc|null>
  companyDetails(companyData:CompanyInput):Promise<CompanyDoc>
  companyFindById(companyId:string):Promise<CompanyDoc|null>
  updateCompanyDetails(companyId:string,members:IMember[]):Promise<CompanyDoc|null>
  companyDetailsByRefferal(refferalCode:string):Promise<CompanyDoc|null>
  updateCompanyRefferal(refferalCode:string,email:string):Promise<CompanyDoc|null>
  updateJoinedStatus(email:string):Promise<CompanyDoc|null>
}
