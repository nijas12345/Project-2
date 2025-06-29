"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projectModal_1 = __importDefault(require("../Model/projectModal"));
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class ProjectServices {
    constructor(projectRepository, adminRepository, userRepository, paymentRepository, companyRepository, taskRepository, chatRepository) {
        this.createProject = async (admin_id, projectData) => {
            try {
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin not found");
                }
                const existingProjects = await this.projectRepository.existingProjectByAdminId(admin_id);
                if (existingProjects.length >= 1) {
                    const status = "active";
                    const paymentData = await this.paymentRepository.paymentStatus(admin_id, status);
                    if (paymentData) {
                        const companyId = adminData.companyId;
                        const sameEmail = adminData.email;
                        if (!companyId)
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company data exists");
                        const companyData = await this.companyRepository.companyFindById(companyId);
                        if (!companyData) {
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company data exists");
                        }
                        const refferalCode = companyData?.refferalCode;
                        const memberEmails = projectData.members.map((member) => member.email);
                        const existingUsers = await this.userRepository.existingUsers(refferalCode, memberEmails);
                        const missingEmails = [];
                        const existingEmails = new Set(existingUsers.map((user) => user.email));
                        for (const email of memberEmails) {
                            if (email == sameEmail) {
                                throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Added your Email in Members input. Please correct it.");
                            }
                            if (!existingEmails.has(email)) {
                                missingEmails.push(email);
                            }
                        }
                        if (missingEmails.length > 0) {
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, `The following emails do not exist in the system: ${missingEmails.join(", ")}. Please invite them through the company dashboard.`);
                        }
                        const projectMembers = projectData.members.map((member) => ({
                            email: member.email,
                            role: member.role,
                        }));
                        projectData.admin_id = admin_id;
                        const project = new projectModal_1.default({
                            name: projectData.name,
                            description: projectData.description,
                            admin_id: projectData.admin_id,
                            members: projectMembers,
                        });
                        return await this.projectRepository.createProject(project);
                    }
                    else {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NoAccess, "Choose a subscription plan from the premium page to create multiple projects");
                    }
                }
                else {
                    const companyId = adminData.companyId;
                    if (!companyId)
                        throw new Error("No Company Id Exists");
                    const sameEmail = adminData.email;
                    const companyData = await this.companyRepository.companyFindById(companyId);
                    if (!companyData) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company data exists");
                    }
                    const refferalCode = companyData?.refferalCode;
                    const memberEmails = projectData.members.map((member) => member.email);
                    const existingUsers = await this.userRepository.existingUsers(refferalCode, memberEmails);
                    const missingEmails = [];
                    const existingEmails = new Set(existingUsers.map((user) => user.email));
                    for (const email of memberEmails) {
                        if (email == sameEmail) {
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Added your Email in Members input. Please correct it.");
                        }
                        if (!existingEmails.has(email)) {
                            missingEmails.push(email);
                        }
                    }
                    if (missingEmails.length > 0) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, `The following emails do not exist in the system: ${missingEmails.join(", ")}. Please invite them through the company dashboard.`);
                    }
                    const projectMembers = projectData.members.map((member) => ({
                        email: member.email,
                        role: member.role,
                    }));
                    projectData.admin_id = admin_id;
                    const project = new projectModal_1.default({
                        name: projectData.name,
                        description: projectData.description,
                        admin_id: projectData.admin_id,
                        members: projectMembers,
                    });
                    return await this.projectRepository.createProject(project);
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.getProjects = async (user_id) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData)
                    throw new Error("No user Data");
                const email = userData.email;
                const projects = await this.projectRepository.getProjects(email);
                if (!projects.length) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Please create a project");
                }
                return projects;
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminProjects = async (admin_id) => {
            try {
                const projects = await this.projectRepository.getAdminProjects(admin_id);
                if (!projects.length) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Please create a project");
                }
                return projects;
            }
            catch (error) {
                throw error;
            }
        };
        this.updateProject = async (admin_id, projectData) => {
            try {
                let admin = await this.adminRepository.findByAdminId(admin_id);
                if (!admin) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin not found");
                }
                const companyId = admin.companyId;
                if (!companyId)
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin not found");
                const sameEmail = admin.email;
                const companyData = await this.companyRepository.companyFindById(companyId);
                if (!companyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company data exists");
                }
                const refferalCode = companyData?.refferalCode;
                const memberEmails = projectData.members.map((member) => member.email);
                const existingUsers = await this.userRepository.existingUsers(refferalCode, memberEmails);
                const missingEmails = [];
                const existingEmails = new Set(existingUsers.map((user) => user.email));
                console.log(existingEmails);
                for (const email of memberEmails) {
                    if (email == sameEmail) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "Added your email in Members input. Please correct it.");
                    }
                    if (!existingEmails.has(email)) {
                        missingEmails.push(email);
                    }
                }
                if (missingEmails.length > 0) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, `The following emails do not exist in the company: ${missingEmails.join(", ")}`);
                }
                const projectMembers = projectData.members.map((member) => ({
                    email: member.email,
                    role: member.role,
                }));
                const projectId = projectData._id;
                if (!projectId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No project ID exists");
                }
                projectData.admin_id = admin_id;
                const name = projectData.name;
                const description = projectData.description;
                const members = projectMembers;
                const updateProject = await this.projectRepository.updateProject(admin_id, projectId, name, description, members);
                return updateProject;
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteProject = async (admin_id, projectId) => {
            try {
                const projects = await this.projectRepository.deleteProject(admin_id, projectId);
                await this.taskRepository.deleteTaskByProjectId(projectId);
                return projects;
            }
            catch (error) {
                throw error;
            }
        };
        this.projectMembers = async (projectId) => {
            try {
                const projectData = await this.projectRepository.projectMembers(projectId);
                if (projectData) {
                    const projectMembers = projectData?.members;
                    return projectMembers;
                }
                else {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "The projectId is wrong");
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.chatProjects = async (user_id) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No project data found");
                }
                const userEmail = userData.email;
                const combinedProjects = await this.projectRepository.combinedProjects(user_id, userEmail);
                if (!combinedProjects.length) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No projects are found");
                }
                const findLatestProjectsByMessage = await this.chatRepository.findLatestProjectsByMessage(combinedProjects);
                return findLatestProjectsByMessage;
            }
            catch (error) {
                throw error;
            }
        };
        this.AdminchatProjects = async (admin_id) => {
            try {
                const combinedProjects = await this.projectRepository.combinedAdminProjects(admin_id);
                if (!combinedProjects.length) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No projects are found");
                }
                const findLatestProjectsByMessage = await this.chatRepository.findLatestProjectsByMessage(combinedProjects);
                return findLatestProjectsByMessage;
            }
            catch (error) {
                throw error;
            }
        };
        this.getSelectedProject = async (project) => {
            try {
                const projectId = project._id;
                if (!projectId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No selected project");
                }
                const projectData = await this.projectRepository.findProjectById(projectId);
                if (!projectData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No project data found");
                }
                const memberEmails = projectData.members.map((member) => member.email);
                const selectedMembers = await this.userRepository.findUsers(memberEmails);
                return selectedMembers;
            }
            catch (error) {
                throw error;
            }
        };
        this.projectRepository = projectRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.companyRepository = companyRepository;
        this.taskRepository = taskRepository;
        this.chatRepository = chatRepository;
    }
}
exports.default = ProjectServices;
