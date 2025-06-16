import { Model } from "mongoose";
import {
  ICompany,
  IMember,
} from "../Interfaces/commonInterface";
import { ICompanyRepository } from "../Interfaces/company.repository.interface";

class CompanyRepository implements ICompanyRepository {

  private companyModel = Model<ICompany>;
  constructor(
    companyModel: Model<ICompany>,
  ) {
    this.companyModel = companyModel;
  }
  existCompanyData = async (companyName: string): Promise<ICompany | null> => {
    try {
      const existCompanyData: ICompany | null = await this.companyModel.findOne(
        { companyName: companyName }
      );
      return existCompanyData;
    } catch (error: unknown) {
      throw error;
    }
  };
  companyDetails = async (companyData: ICompany): Promise<ICompany> => {
    try {
      const companyDetails: ICompany = await this.companyModel.create(
        companyData
      );
      return companyDetails;
    } catch (error: unknown) {
      throw error;
    }
  };
  companyFindById = async (companyId: string): Promise<ICompany | null> => {
    try {
      const companyData: ICompany | null = await this.companyModel.findOne({
        _id: companyId,
      });
      return companyData;
    } catch (error: unknown) {
      throw error;
    }
  };

  updateCompanyDetails = async (
    companyId: string,
    members: IMember[]
  ): Promise<ICompany | null> => {
    try {
      const updatedCompany: ICompany | null =
        await this.companyModel.findOneAndUpdate(
          { _id: companyId },
          { $addToSet: { members: { $each: members } } },
          { new: true }
        );
      return updatedCompany;
    } catch (error: unknown) {
      throw error;
    }
  };

  companyDetailsByRefferal = async (
    refferalCode: string
  ): Promise<ICompany | null> => {
    try {
      const companyDetails: ICompany | null = await this.companyModel.findOne({
        refferalCode: refferalCode,
      });
      return companyDetails;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateCompanyRefferal = async (
    refferalCode: string,
    email: string
  ): Promise<ICompany | null> => {
    try {
      const companyData: ICompany | null =
        await this.companyModel.findOneAndUpdate(
          {
            refferalCode: refferalCode, // Match the referral code
            "members.email": email, // Match the email within the members array
          },
          {
            $set: { "members.$.status": "joined" }, // Update the status of the matching member
          },
          { new: true } // Return the updated document
        );
      return companyData;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateJoinedStatus = async (email: string): Promise<ICompany | null> => {
    try {
      const companyData: ICompany | null =
        await this.companyModel.findOneAndUpdate(
          {
            "members.email": email,
          },
          {
            $set: { "members.$.status": "joined" },
          },
          { new: true }
        );
      return companyData;
    } catch (error: unknown) {
      throw error;
    }
  };
}
export default CompanyRepository;
