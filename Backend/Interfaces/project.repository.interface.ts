import { Types } from "mongoose";
import { MemberInput, ProjectDoc, ProjectInput } from "../Model/projectModal";
import { Projects } from "./commonInterface";

export interface IProjectRepository{
    createProject(project:ProjectInput):Promise<ProjectDoc|null>
    existingProjectByAdminId(admin_id:string):Promise<ProjectDoc[]>
    getProjects(email:string):Promise<ProjectDoc[]>
    findProjectById(projectId:string|Types.ObjectId):Promise<ProjectDoc|null>
    getMeetings(user_id:string):Promise<ProjectDoc[]> 
    getAdminMeetings(admin_id:string):Promise<ProjectDoc[]>
    updateProject(admin_id:string,projectId:Types.ObjectId,name:string,description:string,members:MemberInput[]):Promise<ProjectDoc[]>
    projectMembers(projectId:string):Promise<ProjectDoc|null>  
    combinedProjects(user_id:string,userEmail:string):Promise<Projects[]>
    combinedAdminProjects(admin_id:string):Promise<Projects[]>
    getAdminProjects(user_id:string):Promise<ProjectDoc[]> 
    deleteProject(admin_id:string,projectId:string):Promise<ProjectDoc[]>
    countProjectDocuments(admin_id:string):Promise<number>
}