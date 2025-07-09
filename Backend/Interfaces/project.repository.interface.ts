import { Types } from "mongoose";
import { MemberInput, ProjectDoc, ProjectInput } from "../Model/projectModal";
import { Projects } from "./commonInterface";

//  Core project CRUD
export interface IProjectCoreRepository {
  createProject(project: ProjectInput): Promise<ProjectDoc | null>;
  existingProjectByAdminId(admin_id: string): Promise<ProjectDoc[]>;
  updateProject(
    admin_id: string,
    projectId: Types.ObjectId,
    name: string,
    description: string,
    members: MemberInput[]
  ): Promise<ProjectDoc[]>;
  deleteProject(admin_id: string, projectId: string): Promise<ProjectDoc[]>;
  findProjectById(projectId: string | Types.ObjectId): Promise<ProjectDoc | null>;
}

//  Members & member-related
export interface IProjectMemberRepository {
  projectMembers(projectId: string): Promise<ProjectDoc | null>;
}

//  Meeting-related
export interface IProjectMeetingRepository {
  getMeetings(user_id: string): Promise<ProjectDoc[]>;
  getAdminMeetings(admin_id: string): Promise<ProjectDoc[]>;
}


export interface IProjectListingRepository {
  getProjects(email: string): Promise<ProjectDoc[]>;
  getAdminProjects(user_id: string): Promise<ProjectDoc[]>;
  combinedProjects(user_id: string, userEmail: string): Promise<Projects[]>;
  combinedAdminProjects(admin_id: string): Promise<Projects[]>;
  countProjectDocuments(admin_id: string): Promise<number>;
}

export interface IProjectRepository
  extends IProjectCoreRepository,
          IProjectMemberRepository,
          IProjectMeetingRepository,
          IProjectListingRepository {}
