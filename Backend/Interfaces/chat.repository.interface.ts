import { Projects } from "./commonInterface"
import { MessageDoc, MessageInput } from "../Model/chatModal"

export interface IChatRepository{
   getChats(projectId:string,pageNumber:number,limitNumber:number):Promise<MessageDoc[]>
   getAdminChats(projectId:string,pageNumber:number,limitNumber:number):Promise<MessageDoc[]>
   saveChats(messageDetails:MessageInput):Promise<MessageDoc>
   saveFiles(messageDetails:MessageInput):Promise<MessageDoc>
   deleteChatByProjectId(projectId:string):Promise<void>
   findLatestProjectsByMessage(combinedProjects:Projects[]):Promise<Projects[]>
}