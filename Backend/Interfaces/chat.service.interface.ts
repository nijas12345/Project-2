import { IMeeting, IMessage, IProject} from "./commonInterface"                                   
export interface IChatService {
    getChats(projectId:string,pageNumber:number,limitNumber:number):Promise<IMessage[]>
    getAdminChats(projectId:string,pageNumber:number,limitNumber:number):Promise<IMessage[]>
    saveChats(messageDetails:IMessage):Promise<IMessage>
    saveFiles(messageDetails:IMessage):Promise<IMessage>   
}