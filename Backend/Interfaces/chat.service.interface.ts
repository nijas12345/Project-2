import { MessageDoc, MessageInput } from "../Model/chatModal"                                   
export interface IChatService {
    getChats(projectId:string,pageNumber:number,limitNumber:number):Promise<MessageDoc[]>
    getAdminChats(projectId:string,pageNumber:number,limitNumber:number):Promise<MessageDoc[]>
    saveChats(messageDetails:MessageInput):Promise<MessageDoc>
    saveFiles(messageDetails:MessageInput):Promise<MessageDoc>   
}