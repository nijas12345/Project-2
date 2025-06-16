import { Model, Types } from "mongoose";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import {IUser } from "../Interfaces/commonInterface";

class UserRepository implements IUserRepository {
  private userModel = Model<IUser>;
  constructor(userModel: Model<IUser>) {
    this.userModel = userModel;
  }
  findByEmail = async (email: string): Promise<IUser | null> => {
    try {
      return await this.userModel.findOne({ email });
    } catch (error:unknown) {
      throw error;
    }
  };
  findByUserId = async (user_id: string): Promise<IUser | null> => {
    try {
      const userData: IUser | null = await this.userModel.findOne({
        user_id: user_id,
      });
      return userData
    } catch (error:unknown) {
      throw error
    }
  }
  register = async (userData: IUser): Promise<IUser> => {
    try {
      return await this.userModel.create(userData);
    } catch (error:unknown) {
      throw error;
    }
  };
  login = async (email: string): Promise<IUser | null> => {
    try {
     const userWithoutId: IUser | null = await this.userModel.findOne(
        { email: email },
        { _id: 0 }
      );
      return userWithoutId;
    } catch (error:unknown) {
      throw error;
    }
  };
  verifyGoogleAuth = async (email: string): Promise<IUser | null> => {
    try {
     const userData:IUser|null =  await this.userModel.findOne({ email: email }, { _id: 0 })
     return userData
    } catch (error:unknown) {
      console.log(error);
      return null;
    }
  };
  createUser = async (email: string, user_id: string): Promise<IUser> => {
    try {
      const userData = {
        firstName: email.split("@")[0],
        email,
        user_id,
      };
      const createdUser = await this.userModel.create(userData);
      const { _id, ...userWithoutId } = createdUser.toObject();
      return userWithoutId;
    } catch (error:unknown) {
      throw error
    }
  }
  resetPassword = async (email: string): Promise<IUser | null> => {
    try {
      return await this.userModel.findOne({ email: email });
    } catch (error:unknown) {
      throw error;
    }
  };
  confirmResetPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await this.userModel.findOneAndUpdate(
        { email: email },
        {
          password: password,
        }
      );
    } catch(error:unknown) {
      throw error;
    }
  };
  updateUser = async (user_id: string, user: IUser): Promise<IUser | null> => {
    try {
      const updatedUser: IUser | null = await this.userModel.findOneAndUpdate(
      { user_id: user_id },
      {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        position: user.position,
        companyName: user.city,
        state: user.state,
      },
      { new: true } // ✅ this returns the updated document
    );
    return updatedUser;
    } catch(error:unknown) {
      throw error;
    }
  };
  userBlock = async (user_id: string): Promise<IUser | null> => {
      try {
        const userData: IUser | null = await this.userModel.findOneAndUpdate(
          { user_id: user_id },
          {
            isBlocked: true,
          },
          { new: true }
        );
        return userData;
      } catch(error:unknown) {
        throw error;
      }
    };
    userUnBlock = async (user_id: string): Promise<IUser | null> => {
      try {
        const userData: IUser | null = await this.userModel.findOneAndUpdate(
          { user_id: user_id },
          {
            isBlocked: false,
          },
          { new: true }
        );
        return userData;
      } catch(error:unknown) {
        throw error;
      }
    };
  profilePicture = async (
    user_id: string,
    profileURL: string
  ): Promise<IUser|null> => {
    try {
      const userData: IUser | null = await this.userModel.findOneAndUpdate(
        { user_id: user_id },
        { profileImage: profileURL },
        { new: true }
      );
      return userData
    } catch(error:unknown) {
      throw error;
    }
  };
  addRefferalCodeToUser = async (
    user_id: string,
    refferalCode: string,
    companyId:Types.ObjectId
  ): Promise<IUser | null> => {
    try {
      const userData: IUser | null = await this.userModel.findOneAndUpdate(
        { user_id: user_id },
        {
          refferalCode: refferalCode,
          companyId: companyId,
        },
        { new: true }
      );
      return userData;
    } catch(error:unknown) {
      throw error;
    }
  };
  userWithoutId = async(user_id: string): Promise<IUser | null> => {
    try {    
      const userWithoutId = await this.userModel.findOne(
        { user_id:user_id },
        { _id: 0, companyId: 0 } // Exclude _id and companyId
      );
      return userWithoutId;
    } catch (error:unknown) {
      throw error
    }
  }
    searchProjectMembers = async (
      memberEmails:string[],
      searchQuery:string
    ): Promise<IUser[]> => {
      try {
        const searchRegex = new RegExp(searchQuery, "i");
        const users: IUser[] = await this.userModel.find({
          email: { $in: memberEmails, $regex: searchRegex },
        });
        return users;
      } catch(error:unknown) {
        throw error;
      }
    };
    countUserDocuments = async(companyId: string): Promise<number> => {
      try {
         const userCount: number = await this.userModel.countDocuments({
        companyId: companyId,
      });
      return userCount
      } catch (error:unknown) {
        throw error
      }
    }
    existingUsers = async(refferalCode: string, memberEmails: string[]): Promise<IUser[]> => {
      try {
        const existingUsers:IUser[] = await this.userModel.find({
            email: { $in: memberEmails }, 
            refferalCode: refferalCode, 
        });
        return existingUsers
      } catch (error:unknown) {
        throw error
      }
    }
    findUsers = async (memberEmails: string[]): Promise<IUser[]>  => {
      try {
      const users = await this.userModel.find({ email: { $in: memberEmails } });
      return users;
      } catch (error) {
        throw error
      }
    }
     userIsBlocked = async (user_id: string): Promise<IUser|null> => {
    try {
      const userData: IUser|null = await this.userModel.findOne({
        user_id: user_id,
      });
      return userData;
    } catch (error) {
      throw error;
    }
  };
}

export default UserRepository;
