import { IMember, IProject,IUser,Projects } from "./commonInterface"

export interface IProjectService {
    createProject(user_id:string,projectData:IProject):Promise<IProject|null>
    getProjects(user_id:string):Promise<Projects[]>  
    updateProject(user_id:string,projectData:IProject):Promise<Projects[]>
    projectMembers(projectId:string):Promise<IMember[]>
    chatProjects(user_id:string):Promise<Projects[]>
    AdminchatProjects(admin_id:string):Promise<Projects[]>
    getAdminProjects(user_id:string):Promise<Projects[]> 
    getSelectedProject(project:IProject):Promise<IUser[]>
    deleteProject(admin_id:string,projectId:string):Promise<Projects[]>
}