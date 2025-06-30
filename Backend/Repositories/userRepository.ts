import { Model, Types } from "mongoose";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { UserDoc } from "../Model/userModal";
import BaseRepository from "./base/baseRepository";

class UserRepository
  extends BaseRepository<UserDoc>
  implements IUserRepository
{
  private userModel = Model<UserDoc>;
  constructor(userModel: Model<UserDoc>) {
    super(userModel);
    this.userModel = userModel;
  }
  findByEmail = async (email: string): Promise<UserDoc | null> => {
    try {
      return await this.findOne({ email });
    } catch (error: unknown) {
      throw error;
    }
  };
  findByUserId = async (user_id: string): Promise<UserDoc | null> => {
    try {
      return await this.findOne({
        user_id,
      });
    } catch (error: unknown) {
      throw error;
    }
  };
  register = async (userData: UserDoc): Promise<UserDoc> => {
    try {
      return await this.createData(userData);
    } catch (error: unknown) {
      throw error;
    }
  };
  login = async (email: string): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOne({ email: email }, { _id: 0 });
    } catch (error: unknown) {
      throw error;
    }
  };
  verifyGoogleAuth = async (email: string): Promise<UserDoc | null> => {
    try {
      return await this.findOne({ email }, { _id: 0 });
    } catch (error: unknown) {
      console.log(error);
      return null;
    }
  };
  createUser = async (email: string, user_id: string): Promise<UserDoc> => {
    try {
      const userData = {
        firstName: email.split("@")[0],
        email,
        user_id,
      };
      const createdUser = await this.userModel.create(userData);
      const { _id, ...userWithoutId } = createdUser.toObject();
      return userWithoutId;
    } catch (error: unknown) {
      throw error;
    }
  };
  resetPassword = async (email: string): Promise<UserDoc | null> => {
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
      await this.findOneAndUpdate(
        { email: email },
        {
          password: password,
        }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  updateUser = async (
    user_id: string,
    user: UserDoc
  ): Promise<UserDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { user_id: user_id },
        {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          position: user.position,
          city: user.city,
          state: user.state,
        }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  userBlock = async (user_id: string): Promise<UserDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { user_id: user_id },
        {
          isBlocked: true,
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  userUnBlock = async (user_id: string): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOneAndUpdate(
        { user_id: user_id },
        {
          isBlocked: false,
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  profilePicture = async (
    user_id: string,
    profileURL: string
  ): Promise<UserDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { user_id },
        { profileImage: profileURL },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  addRefferalCodeToUser = async (
    user_id: string,
    refferalCode: string,
    companyId: Types.ObjectId
  ): Promise<UserDoc | null> => {
    try {
      const userData: UserDoc | null = await this.findOneAndUpdate(
        { user_id },
        {
          refferalCode,
          companyId,
        }
      );
      return userData;
    } catch (error: unknown) {
      throw error;
    }
  };
  userWithoutId = async (user_id: string): Promise<UserDoc | null> => {
    try {
      return await this.findOne(
        { user_id: user_id },
        { _id: 0, companyId: 0 } // Exclude _id and companyId
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  searchProjectMembers = async (
    memberEmails: string[],
    searchQuery: string
  ): Promise<UserDoc[]> => {
    try {
      const searchRegex = new RegExp(searchQuery, "i");
      return await this.findAll({
        email: { $in: memberEmails, $regex: searchRegex },
      });
    } catch (error: unknown) {
      throw error;
    }
  };
  countUserDocuments = async (companyId: string): Promise<number> => {
    try {
      const userCount: number = await this.userModel.countDocuments({
        companyId: companyId,
      });
      return userCount;
    } catch (error: unknown) {
      throw error;
    }
  };
  existingUsers = async (
    refferalCode: string,
    memberEmails: string[]
  ): Promise<UserDoc[]> => {
    try {
      return await this.findAll({
        email: { $in: memberEmails },
        refferalCode,
      });
    } catch (error: unknown) {
      throw error;
    }
  };
  findUsers = async (memberEmails: string[]): Promise<UserDoc[]> => {
    try {
      return await this.findAll({ email: { $in: memberEmails } });
    } catch (error) {
      throw error;
    }
  };
  userIsBlocked = async (user_id: string): Promise<UserDoc | null> => {
    try {
      return await this.findOne({
        user_id,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default UserRepository;
