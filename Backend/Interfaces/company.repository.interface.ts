import { ICompany, IMember, ICompanyMember,} from "./commonInterface";

export interface ICompanyRepository{
  existCompanyData(companyName:string):Promise<ICompany|null>
  companyDetails(companyData:ICompany):Promise<ICompany>
  companyFindById(companyId:string):Promise<ICompany|null>
  updateCompanyDetails(companyId:string,members:IMember[]):Promise<ICompany|null>
  companyDetailsByRefferal(refferalCode:string):Promise<ICompany|null>
  updateCompanyRefferal(refferalCode:string,email:string):Promise<ICompany|null>
  updateJoinedStatus(email:string):Promise<ICompany|null>
}
