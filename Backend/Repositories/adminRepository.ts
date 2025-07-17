import { Model } from "mongoose";
import { AdminDoc } from "../Model/adminModal";
import { Types } from "mongoose";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import BaseRepository from "./base/baseRepository";

class AdminRepository
  extends BaseRepository<AdminDoc>
  implements IAdminRepository
{ 
  private adminModel = Model<AdminDoc>;
  constructor(adminModel: Model<AdminDoc>) {
    super(adminModel);
    this.adminModel = adminModel;
  }
  findByEmail = async (email: string): Promise<AdminDoc | null> => {
    try {
      return await this.findOne({ email });
    } catch (error: unknown) {
      throw error;
    }
  };
  register = async (adminData: AdminDoc): Promise<AdminDoc> => {
    try {
      return await this.createData(adminData);
    } catch (error: unknown) {
      throw error;
    }
  };
  login = async (email: string): Promise<AdminDoc | null> => {
    try {
      return await this.findOne({ email }, { _id: 0 });
    } catch (error: unknown) {
      throw error;
    }
  };
  verifyGoogleAuth = async (email: string): Promise<AdminDoc | null> => {
    try {
      return await this.findOne({ email }, { _id: 0 });
    } catch (error: unknown) {
      throw error;
    }
  };
  createAdmin = async (email: string, admin_id: string): Promise<AdminDoc> => {
    try {
      const adminData = {
        firstName: email.split("@")[0],
        email,
        admin_id,
      };
      const createdAdmin = await this.adminModel.create(adminData);
      const { _id, ...adminWithoutId } = createdAdmin.toObject();
      return adminWithoutId;
    } catch (error: unknown) {
      throw error;
    }
  };
  resetPassword = async (email: string): Promise<AdminDoc | null> => {
    try {
      return await this.findOne({ email });
    } catch (error: unknown) {
      throw error;
    }
  };
  confirmResetPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await this.findOneAndUpdate({ email }, { $set: { password: password } });
    } catch (error: unknown) {
      throw error;
    }
  };

  findByAdminId = async (admin_id: string): Promise<AdminDoc | null> => {
    try {
      return await this.findOne({ admin_id });
    } catch (error: unknown) {
      throw error;
    }
  };

  updateProfileImage = async (
    admin_id: string,
    profileURL: string
  ): Promise<AdminDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { admin_id },
        { $set: { profileImage: profileURL } }
      );
    } catch (error: unknown) {
      throw error;
    }
  };

  updateAdmin = async (
    admin_id: string,
    admin: AdminDoc
  ): Promise<AdminDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { admin_id },
        {
          firstName: admin.firstName,
          lastName: admin.lastName,
          phone: admin.phone,
          address: admin.address,
          position: admin.position,
          city: admin.city,
          state: admin.state,
        }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  updateCompanyDetails = async (
    companyId: Types.ObjectId,
    admin_id: string
  ): Promise<AdminDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { admin_id },
        {
          companyId,
        }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default AdminRepository;



