import { Types } from "mongoose";
import { IAdmin, IMember, IProject,IUser,Projects  } from "./commonInterface";

export interface IProjectRepository{
    createProject(project:IProject):Promise<IProject|null>
    existingProjectByAdminId(admin_id:string):Promise<IProject[]>
    getProjects(email:string):Promise<Projects[]>
    findProjectById(projectId:string|Types.ObjectId):Promise<IProject|null>
    getMeetings(user_id:string):Promise<IProject[]> 
    getAdminMeetings(admin_id:string):Promise<IProject[]>
    updateProject(admin_id:string,projectId:Types.ObjectId,name:string,description:string,members:IMember[]):Promise<Projects[]>
    projectMembers(projectId:string):Promise<IProject|null>  
    combinedProjects(user_id:string,userEmail:string):Promise<Projects[]>
    combinedAdminProjects(admin_id:string):Promise<Projects[]>
    getAdminProjects(user_id:string):Promise<Projects[]> 
    deleteProject(admin_id:string,projectId:string):Promise<Projects[]>
    countProjectDocuments(admin_id:string):Promise<number>
}