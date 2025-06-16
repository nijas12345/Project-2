import { IMeeting, IMessage, IProject, Projects } from "./commonInterface"

export interface IChatRepository{
   getChats(projectId:string,pageNumber:number,limitNumber:number):Promise<IMessage[]>
   getAdminChats(projectId:string,pageNumber:number,limitNumber:number):Promise<IMessage[]>
   saveChats(messageDetails:IMessage):Promise<IMessage>
   saveFiles(messageDetails:IMessage):Promise<IMessage>
   deleteChatByProjectId(projectId:string):Promise<void>
   findLatestProjectsByMessage(combinedProjects:Projects[]):Promise<Projects[]>
}