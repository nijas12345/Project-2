import { MemberDoc, ProjectDoc, ProjectInput } from "../Model/projectModal"
import { UserDoc } from "../Model/userModal"
import { Projects } from "./commonInterface"

export interface IProjectService {
    createProject(user_id:string,projectData:ProjectInput):Promise<ProjectDoc|null>
    getProjects(user_id:string):Promise<ProjectDoc[]>  
    updateProject(user_id:string,projectData:ProjectDoc):Promise<ProjectDoc[]>
    projectMembers(projectId:string):Promise<MemberDoc[]>
    chatProjects(user_id:string):Promise<Projects[]>
    AdminchatProjects(admin_id:string):Promise<Projects[]>
    getAdminProjects(user_id:string):Promise<ProjectDoc[]> 
    getSelectedProject(project:ProjectDoc):Promise<UserDoc[]>
    deleteProject(admin_id:string,projectId:string):Promise<ProjectDoc[]>
}