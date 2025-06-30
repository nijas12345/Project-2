import { Projects } from "../Interfaces/commonInterface";
import { IProjectService } from "../Interfaces/project.service.interface";
import { IProjectRepository } from "../Interfaces/project.repository.interface";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { IPaymentRepository } from "../Interfaces/payment.repository.interface";
import { ICompanyRepository } from "../Interfaces/company.repository.interface";
import Project, {
  MemberDoc,
  MemberInput,
  ProjectDoc,
  ProjectInput,
} from "../Model/projectModal";
import { ITaskRepository } from "../Interfaces/task.repository.interface";
import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { Types } from "mongoose";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { AdminDoc } from "../Model/adminModal";
import { UserDoc } from "../Model/userModal";
import { CompanyDoc } from "../Model/companyModal";
import { PaymentDoc } from "../Model/paymentModal";

class ProjectServices implements IProjectService {
  private projectRepository: IProjectRepository;
  private adminRepository: IAdminRepository;
  private userRepository: IUserRepository;
  private paymentRepository: IPaymentRepository;
  private companyRepository: ICompanyRepository;
  private taskRepository: ITaskRepository;
  private chatRepository: IChatRepository;
  constructor(
    projectRepository: IProjectRepository,
    adminRepository: IAdminRepository,
    userRepository: IUserRepository,
    paymentRepository: IPaymentRepository,
    companyRepository: ICompanyRepository,
    taskRepository: ITaskRepository,
    chatRepository: IChatRepository
  ) {
    this.projectRepository = projectRepository;
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
    this.companyRepository = companyRepository;
    this.taskRepository = taskRepository;
    this.chatRepository = chatRepository;
  }
  createProject = async (
    admin_id: string,
    projectData: ProjectInput
  ): Promise<ProjectDoc | null> => {
    try {
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin not found");
      }
      const existingProjects: ProjectDoc[] =
        await this.projectRepository.existingProjectByAdminId(admin_id);
      if (existingProjects.length >= 1) {
        const status = "active";
        const paymentData: PaymentDoc | null =
          await this.paymentRepository.paymentStatus(admin_id, status);
        if (paymentData) {
          const companyId = adminData.companyId;
          const sameEmail = adminData.email;
          if (!companyId)
            throw new HttpError(
              HTTP_statusCode.NotFound,
              "No company data exists"
            );
          const companyData: CompanyDoc | null =
            await this.companyRepository.companyFindById(companyId);
          if (!companyData) {
            throw new HttpError(
              HTTP_statusCode.NotFound,
              "No company data exists"
            );
          }
          const refferalCode: string = companyData?.refferalCode;
          const memberEmails = projectData.members.map(
            (member) => member.email
          );
          const existingUsers: UserDoc[] =
            await this.userRepository.existingUsers(refferalCode, memberEmails);
          const missingEmails = [];
          const existingEmails = new Set(
            existingUsers.map((user) => user.email)
          );
          for (const email of memberEmails) {
            if (email == sameEmail) {
              throw new HttpError(
                HTTP_statusCode.BadRequest,
                "Added your Email in Members input. Please correct it."
              );
            }
            if (!existingEmails.has(email)) {
              missingEmails.push(email);
            }
          }
          if (missingEmails.length > 0) {
            throw new HttpError(
              HTTP_statusCode.BadRequest,
              `The following emails do not exist in the system: ${missingEmails.join(
                ", "
              )}. Please invite them through the company dashboard.`
            );
          }
          const projectMembers = projectData.members.map((member) => ({
            email: member.email,
            role: member.role,
          }));
          projectData.admin_id = admin_id;
          const project: ProjectInput = new Project({
            name: projectData.name,
            description: projectData.description,
            admin_id: projectData.admin_id,
            members: projectMembers,
          });
          return await this.projectRepository.createProject(project);
        } else {
          throw new HttpError(
            HTTP_statusCode.NoAccess,
            "Choose a subscription plan from the premium page to create multiple projects"
          );
        }
      } else {
        const companyId = adminData.companyId;
        if (!companyId) throw new Error("No Company Id Exists");
        const sameEmail = adminData.email;
        const companyData: CompanyDoc | null =
          await this.companyRepository.companyFindById(companyId);
        if (!companyData) {
          throw new HttpError(
            HTTP_statusCode.NotFound,
            "No company data exists"
          );
        }
        const refferalCode: string = companyData?.refferalCode;
        const memberEmails = projectData.members.map((member) => member.email);
        const existingUsers = await this.userRepository.existingUsers(
          refferalCode,
          memberEmails
        );
        const missingEmails = [];
        const existingEmails = new Set(existingUsers.map((user) => user.email));
        for (const email of memberEmails) {
          if (email == sameEmail) {
            throw new HttpError(
              HTTP_statusCode.BadRequest,
              "Added your Email in Members input. Please correct it."
            );
          }
          if (!existingEmails.has(email)) {
            missingEmails.push(email);
          }
        }
        if (missingEmails.length > 0) {
          throw new HttpError(
            HTTP_statusCode.BadRequest,
            `The following emails do not exist in the system: ${missingEmails.join(
              ", "
            )}. Please invite them through the company dashboard.`
          );
        }
        const projectMembers = projectData.members.map((member) => ({
          email: member.email,
          role: member.role,
        }));
        projectData.admin_id = admin_id;
        const project = new Project({
          name: projectData.name,
          description: projectData.description,
          admin_id: projectData.admin_id,
          members: projectMembers,
        });
        return await this.projectRepository.createProject(project);
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  getProjects = async (user_id: string): Promise<ProjectDoc[]> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) throw new Error("No user Data");
      const email = userData.email;
      const projects: ProjectDoc[] = await this.projectRepository.getProjects(
        email
      );
      if (!projects.length) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Please create a project"
        );
      }
      return projects;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminProjects = async (admin_id: string): Promise<ProjectDoc[]> => {
    try {
      const projects: ProjectDoc[] =
        await this.projectRepository.getAdminProjects(admin_id);
      if (!projects.length) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Please create a project"
        );
      }
      return projects;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateProject = async (
    admin_id: string,
    projectData: ProjectDoc
  ): Promise<ProjectDoc[]> => {
    try {
      let admin: AdminDoc | null = await this.adminRepository.findByAdminId(
        admin_id
      );
      if (!admin) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin not found");
      }
      const companyId = admin.companyId;
      if (!companyId)
        throw new HttpError(HTTP_statusCode.NotFound, "Admin not found");
      const sameEmail = admin.email;
      const companyData: CompanyDoc | null =
        await this.companyRepository.companyFindById(companyId);
      if (!companyData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No company data exists");
      }
      const refferalCode: string = companyData?.refferalCode;
      const memberEmails = projectData.members.map((member) => member.email);
      const existingUsers = await this.userRepository.existingUsers(
        refferalCode,
        memberEmails
      );
      const missingEmails = [];
      const existingEmails = new Set(existingUsers.map((user) => user.email));
      console.log(existingEmails);
      for (const email of memberEmails) {
        if (email == sameEmail) {
          throw new HttpError(
            HTTP_statusCode.BadRequest,
            "Added your email in Members input. Please correct it."
          );
        }
        if (!existingEmails.has(email)) {
          missingEmails.push(email);
        }
      }
      if (missingEmails.length > 0) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          `The following emails do not exist in the company: ${missingEmails.join(
            ", "
          )}`
        );
      }
      const projectMembers: MemberInput[] = projectData.members.map(
        (member) => ({
          email: member.email,
          role: member.role,
        })
      );
      const projectId = projectData._id;
      if (!projectId) {
        throw new HttpError(HTTP_statusCode.BadRequest, "No project ID exists");
      }
      projectData.admin_id = admin_id;
      const name: string = projectData.name;
      const description: string = projectData.description;
      const members: MemberInput[] = projectMembers;
      const updateProject: ProjectDoc[] =
        await this.projectRepository.updateProject(
          admin_id,
          projectId,
          name,
          description,
          members
        );
      return updateProject;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteProject = async (
    admin_id: string,
    projectId: string
  ): Promise<ProjectDoc[]> => {
    try {
      const projects: ProjectDoc[] = await this.projectRepository.deleteProject(
        admin_id,
        projectId
      );
      await this.taskRepository.deleteTaskByProjectId(projectId);
      return projects;
    } catch (error: unknown) {
      throw error;
    }
  };
  projectMembers = async (projectId: string): Promise<MemberDoc[]> => {
    try {
      const projectData: ProjectDoc | null =
        await this.projectRepository.projectMembers(projectId);
      if (projectData) {
        const projectMembers: MemberDoc[] = projectData?.members;
        return projectMembers;
      } else {
        throw new HttpError(HTTP_statusCode.NotFound, "The projectId is wrong");
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  chatProjects = async (user_id: string): Promise<Projects[]> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No project data found");
      }
      const userEmail: string = userData.email;

      const combinedProjects: Projects[] =
        await this.projectRepository.combinedProjects(user_id, userEmail);
      if (!combinedProjects.length) {
        throw new HttpError(HTTP_statusCode.NotFound, "No projects are found");
      }
      const findLatestProjectsByMessage: Projects[] =
        await this.chatRepository.findLatestProjectsByMessage(combinedProjects);
      return findLatestProjectsByMessage;
    } catch (error: unknown) {
      throw error;
    }
  };
  AdminchatProjects = async (admin_id: string): Promise<Projects[]> => {
    try {
      const combinedProjects: Projects[] =
        await this.projectRepository.combinedAdminProjects(admin_id);
      if (!combinedProjects.length) {
        throw new HttpError(HTTP_statusCode.NotFound, "No projects are found");
      }
      const findLatestProjectsByMessage: Projects[] =
        await this.chatRepository.findLatestProjectsByMessage(combinedProjects);
      return findLatestProjectsByMessage;
    } catch (error: unknown) {
      throw error;
    }
  };
  getSelectedProject = async (project: ProjectDoc): Promise<UserDoc[]> => {
    try {
      const projectId: Types.ObjectId | undefined = project._id;
      if (!projectId) {
        throw new HttpError(HTTP_statusCode.BadRequest, "No selected project");
      }

      const projectData: ProjectDoc | null =
        await this.projectRepository.findProjectById(projectId);
      if (!projectData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No project data found");
      }
      const memberEmails: string[] = projectData.members.map(
        (member) => member.email
      );
      const selectedMembers: UserDoc[] = await this.userRepository.findUsers(
        memberEmails
      );
      return selectedMembers;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default ProjectServices;
