import { Model } from "mongoose";
import { IAdmin } from "../Interfaces/commonInterface";
import { Types } from "mongoose";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";

class AdminRepository implements IAdminRepository {
  private adminModel = Model<IAdmin>;
  constructor(adminModel: Model<IAdmin>) {
    this.adminModel = adminModel;
  }
  findByEmail = async (email: string): Promise<IAdmin | null> => {
    try {
      return await this.adminModel.findOne({ email });
    } catch (error: unknown) {
      throw error;
    }
  };
  register = async (adminData: IAdmin): Promise<IAdmin> => {
    try {
      return await this.adminModel.create(adminData);
    } catch (error: unknown) {
      throw error;
    }
  };
  login = async (email: string): Promise<IAdmin | null> => {
    try {
      const admin: IAdmin | null = await this.adminModel.findOne(
        { email },
        { _id: 0 }
      );
      return admin;
    } catch (error: unknown) {
      throw error;
    }
  };
  verifyGoogleAuth = async (email: string): Promise<IAdmin | null> => {
    try {
      return await this.adminModel.findOne({ email: email }, { _id: 0 });
    } catch (error: unknown) {
      throw error;
    }
  };
  createAdmin = async (email: string, admin_id: string): Promise<IAdmin> => {
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
  resetPassword = async (email: string): Promise<IAdmin | null> => {
    try {
      return await this.adminModel.findOne({ email: email });
    } catch (error: unknown) {
      throw error;
    }
  };
  confirmResetPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await this.adminModel.findOneAndUpdate(
        { email: email },
        {
          password: password,
        }
      );
    } catch (error: unknown) {
      throw error;
    }
  };

  findByAdminId = async (admin_id: string): Promise<IAdmin | null> => {
    try {
      return await this.adminModel.findOne({ admin_id });
    } catch (error: unknown) {
      throw error;
    }
  };

  updateProfileImage = async (
    admin_id: string,
    profileURL: string
  ): Promise<IAdmin | null> => {
    try {
      return await this.adminModel.findOneAndUpdate(
        { admin_id },
        { profileImage: profileURL },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };

  updateAdmin = async (
    admin_id: string,
    admin: IAdmin
  ): Promise<IAdmin | null> => {
    try {
      const updatedAdmin: IAdmin | null =
        await this.adminModel.findOneAndUpdate(
          { admin_id },
          {
            firstName: admin.firstName,
            lastName: admin.lastName,
            phone: admin.phone,
            address: admin.address,
            position: admin.position,
            city: admin.city,
            state: admin.state,
          },
          { new: true }
        );

      return updatedAdmin;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateCompanyDetails = async (
    companyId: Types.ObjectId,
    admin_id: string
  ): Promise<IAdmin | null> => {
    try {
      const adminData: IAdmin | null = await this.adminModel.findOneAndUpdate(
        { admin_id: admin_id },
        {
          companyId: companyId,
        },
        { new: true }
      );
      return adminData;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default AdminRepository;
