import { Model, Types } from "mongoose";
import { IProjectRepository } from "../Interfaces/project.repository.interface";
import { MemberInput, ProjectDoc, ProjectInput } from "../Model/projectModal";
import { Projects } from "../Interfaces/commonInterface";
import BaseRepository from "./base/baseRepository";

class ProjectRepository extends BaseRepository<ProjectDoc> implements IProjectRepository {

  private projectModel = Model<ProjectDoc>;
  constructor(
    projectModel: Model<ProjectDoc>,
  ) {
    super(projectModel)
    this.projectModel = projectModel;
  }
  createProject = async (
    project: ProjectInput
  ): Promise<ProjectDoc | null> => {
    try {
    return await this.createData(project);
    } catch(error:unknown) {
      throw error;
    }
  };
  existingProjectByAdminId = async(admin_id: string): Promise<ProjectDoc[]> => {
    try {
      return await this.findAll({
        admin_id
      });
    } catch (error:unknown) {
      throw error
    }
  }
  getProjects = async (email: string): Promise<ProjectDoc[]> => {
    try {
      return await this.projectModel
        .find({
          members: { $elemMatch: { email: email } },
        })
        .sort({ createdAt: -1 });
    } catch(error:unknown) {
      throw error;
    }
  };
  getAdminProjects = async (admin_id: string): Promise<ProjectDoc[]> => {
    try {
      return await this.projectModel
        .find({ admin_id: admin_id })
        .sort({ createdAt: -1 });
    } catch(error:unknown) {
      throw error;
    }
  };
  getMeetings = async (email: string): Promise<ProjectDoc[]> => {
    try {
      return await this.findAll({
        "members.email": email,
      });
    } catch(error:unknown) {
      throw error;
    }
  };
   getAdminMeetings = async (admin_id: string): Promise<ProjectDoc[]> => {
      try {
        return await this.findAll({
          admin_id
        });
      } catch(error:unknown) {
        throw error;
      }
    };
    findProjectById = async (projectId: string|Types.ObjectId): Promise<ProjectDoc | null> => {
      try {
        return await this.projectModel.findById(
        projectId
      );
      } catch (error) {
        throw error
      }
    }
  updateProject = async (
    admin_id: string,
    projectId:Types.ObjectId,
    name:string,
    description:string,
    members:MemberInput[]
  ): Promise<ProjectDoc[]> => {
    try {
      const updateProject = {
        admin_id,
        name,
        description,
        members
      };
      await this.findOneAndUpdate(
        { _id: projectId },
        {
          $set: updateProject,
        }
      );
      return await this.projectModel
        .find({ admin_id: admin_id })
        .sort({ createdAt: -1 });

    } catch(error:unknown) {
      console.log(error);
      throw error;
    }
  };
  projectMembers = async (projectId: string): Promise<ProjectDoc | null> => {
    try {
      return await this.findOne({
        _id: projectId,
      });
    } catch(error:unknown) {
      throw error;
    }
  };
  deleteProject = async (
    admin_id: string,
    projectId: string
  ): Promise<ProjectDoc[]> => {
    try {
      await this.deleteOne({ _id: projectId });
      return await this.projectModel.find({
        admin_id
      });
    } catch(error:unknown) {
      throw error;
    }
  };
  combinedProjects = async (user_id:string,userEmail: string): Promise<Projects[]> => {
    try {
      return await this.projectModel.find({
        $or: [{ "members.email": userEmail }, { user_id: user_id }],
      });
    } catch(error:unknown) {
      throw error;
    }
  };
  combinedAdminProjects = async (admin_id:string):Promise<Projects[]> =>{
    try {
      return await this.projectModel.find({
        admin_id
      });
    } catch (error) {
      throw error
    }
  }
  countProjectDocuments = async (admin_id: string): Promise<number> => {
    try {
      return await this.projectModel.countDocuments({
        admin_id
      });
    } catch (error) {
      throw error
    }
  }
}

export default ProjectRepository;
