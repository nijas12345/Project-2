import { Model } from "mongoose";
import { IMember } from "../Interfaces/commonInterface";
import { ICompanyRepository } from "../Interfaces/company.repository.interface";
import { CompanyDoc } from "../Model/companyModal";
import BaseRepository from "./base/baseRepository";

class CompanyRepository
  extends BaseRepository<CompanyDoc>
  implements ICompanyRepository
{
  private companyModel = Model<CompanyDoc>;
  constructor(companyModel: Model<CompanyDoc>) {
    super(companyModel);
    this.companyModel = companyModel;
  }
  existCompanyData = async (
    companyName: string
  ): Promise<CompanyDoc | null> => {
    try {
      return await this.findOne({ companyName });
    } catch (error: unknown) {
      throw error;
    }
  };
  companyDetails = async (companyData: CompanyDoc): Promise<CompanyDoc> => {
    try {
      return await this.createData(companyData);
    } catch (error: unknown) {
      throw error;
    }
  };
  companyFindById = async (companyId: string): Promise<CompanyDoc | null> => {
    try {
      return await this.findOne({
        _id: companyId,
      });
    } catch (error: unknown) {
      throw error;
    }
  };

  updateCompanyDetails = async (
    companyId: string,
    members: IMember[]
  ): Promise<CompanyDoc | null> => {
    try {
      const updatedCompany: CompanyDoc | null =
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
  ): Promise<CompanyDoc | null> => {
    try {
      return await this.findOne({
        refferalCode,
      });
    } catch (error: unknown) {
      throw error;
    }
  };
  updateCompanyRefferal = async (
    refferalCode: string,
    email: string
  ): Promise<CompanyDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        {
          refferalCode: refferalCode, // Match the referral code
          "members.email": email, // Match the email within the members array
        },
        {
          $set: { "members.$.status": "joined" }, // Update the status of the matching member
        },
        { new: true } // Return the updated document
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  updateJoinedStatus = async (email: string): Promise<CompanyDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        {
          "members.email": email,
        },
        {
          $set: { "members.$.status": "joined" },
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
}
export default CompanyRepository;
