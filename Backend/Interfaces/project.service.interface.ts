import { MemberDoc, ProjectDoc, ProjectInput } from "../Model/projectModal"
import { UserDoc } from "../Model/userModal"
import { Projects } from "./commonInterface"

//  Core Project Management
export interface IProjectCoreService {
  createProject(user_id: string, projectData: ProjectInput): Promise<ProjectDoc | null>;
  updateProject(user_id: string, projectData: ProjectDoc): Promise<ProjectDoc[]>;
  deleteProject(admin_id: string, projectId: string): Promise<ProjectDoc[]>;
}

//  Project Fetching for user/admin
export interface IProjectAccessService {
  getProjects(user_id: string): Promise<ProjectDoc[]>;
  getAdminProjects(user_id: string): Promise<ProjectDoc[]>;
}

//  Project views for chat modules
export interface IProjectChatService {
  chatProjects(user_id: string): Promise<Projects[]>;
  AdminchatProjects(admin_id: string): Promise<Projects[]>;
}

// Project member utilities
export interface IProjectMemberService {
  projectMembers(projectId: string): Promise<MemberDoc[]>;
  getSelectedProject(project: ProjectDoc): Promise<UserDoc[]>;
}

//  Final Aggregated Interface
export interface IProjectService
  extends IProjectCoreService,
          IProjectAccessService,
          IProjectChatService,
          IProjectMemberService {}