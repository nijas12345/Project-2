import { Model, Types } from "mongoose";
import { IProjectRepository } from "../Interfaces/project.repository.interface";
import {
  IMessage,
  IProject,
  IUser,
  Projects,
  LatestMessage,
  IAdmin,
  IPayment,
  ITask,
  ICompany,
  IMember,
} from "../Interfaces/commonInterface";

class ProjectRepository implements IProjectRepository {

  private projectModel = Model<IProject>;
  constructor(
    projectModel: Model<IProject>,
  ) {
    this.projectModel = projectModel;
  }
  createProject = async (
    project: IProject
  ): Promise<IProject | null> => {
    try {
    const projectData:IProject|null = await this.projectModel.create(project);
    return projectData;
    } catch(error:unknown) {
      throw error;
    }
  };
  existingProjectByAdminId = async(admin_id: string): Promise<IProject[]> => {
    try {
      const existingProjects: IProject[] = await this.projectModel.find({
        admin_id: admin_id,
      });
      return existingProjects
    } catch (error:unknown) {
      throw error
    }
  }
  getProjects = async (email: string): Promise<Projects[]> => {
    try {
      const projects: Projects[] = await this.projectModel
        .find({
          members: { $elemMatch: { email: email } },
        })
        .sort({ createdAt: -1 });
      return projects;
    } catch(error:unknown) {
      throw error;
    }
  };
  getAdminProjects = async (admin_id: string): Promise<Projects[]> => {
    try {
      const projects: Projects[] = await this.projectModel
        .find({ admin_id: admin_id })
        .sort({ createdAt: -1 });
      return projects;
    } catch(error:unknown) {
      throw error;
    }
  };
  getMeetings = async (email: string): Promise<IProject[]> => {
    try {
      const projectData: IProject[] = await this.projectModel.find({
        "members.email": email,
      });
      return projectData;
    } catch(error:unknown) {
      throw error;
    }
  };
   getAdminMeetings = async (admin_id: string): Promise<IProject[]> => {
      try {
        const projectData: IProject[] = await this.projectModel.find({
          admin_id: admin_id,
        });
        return projectData;
      } catch(error:unknown) {
        throw error;
      }
    };
    findProjectById = async (projectId: string|Types.ObjectId): Promise<IProject | null> => {
      try {
        const projectData: IProject | null = await this.projectModel.findById(
        projectId
      );
      return projectData
      } catch (error) {
        throw error
      }
    }
  updateProject = async (
    admin_id: string,
    projectId:Types.ObjectId,
    name:string,
    description:string,
    members:IMember[]
  ): Promise<Projects[]> => {
    try {
      const updateProject = {
        admin_id,
        name,
        description,
        members
      };
      await this.projectModel.findOneAndUpdate(
        { _id: projectId },
        {
          $set: updateProject,
        }
      );
      const projects = await this.projectModel
        .find({ admin_id: admin_id })
        .sort({ createdAt: -1 });
      return projects;
    } catch(error:unknown) {
      console.log(error);
      throw error;
    }
  };
  projectMembers = async (projectId: string): Promise<IProject | null> => {
    try {
      const projectData: IProject | null = await this.projectModel.findOne({
        _id: projectId,
      });
      return projectData;
    } catch(error:unknown) {
      throw error;
    }
  };
  deleteProject = async (
    admin_id: string,
    projectId: string
  ): Promise<Projects[]> => {
    try {
      await this.projectModel.findOneAndDelete({ _id: projectId });
      const projects: Projects[] = await this.projectModel.find({
        admin_id: admin_id,
      });
      return projects;
    } catch(error:unknown) {
      throw error;
    }
  };
  combinedProjects = async (user_id:string,userEmail: string): Promise<Projects[]> => {
    try {
      const combinedProjects: Projects[] = await this.projectModel.find({
        $or: [{ "members.email": userEmail }, { user_id: user_id }],
      });
     return combinedProjects
    } catch(error:unknown) {
      throw error;
    }
  };
  combinedAdminProjects = async (admin_id:string):Promise<Projects[]> =>{
    try {
      const combinedProjects: Projects[] = await this.projectModel.find({
        admin_id: admin_id,
      });
      return combinedProjects
    } catch (error) {
      throw error
    }
  }
  countProjectDocuments = async (admin_id: string): Promise<number> => {
    try {
      const projectCount = await this.projectModel.countDocuments({
        admin_id: admin_id,
      });
      return projectCount
    } catch (error) {
      throw error
    }
  }
}

export default ProjectRepository;
