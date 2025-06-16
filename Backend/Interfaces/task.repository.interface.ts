import { Types } from "mongoose"
import { IAdmin, IComments, ITask, IUser } from "./commonInterface"

export interface ITaskRepository {
    taskFindById(taskId:Types.ObjectId):Promise<ITask|null>
    taskDetails(taskDetails:ITask):Promise<ITask>
    showTask(taskId:string):Promise<ITask|null>
    updateTaskStatus(taskId:string,status:string,projectId:string):Promise<ITask[]>
    deleteTask(taskId:string):Promise<ITask|null>
    deleteTaskByProjectId(projectId:string):Promise<void>
    findAllTasks():Promise<ITask[]>
    adminCountTasks(user_id:string):Promise<ITask[]>
    editTask(taskId:Types.ObjectId,updateFields:ITask):Promise<ITask|null>
    adminTasks(admin_id:string,projectId:string|null):Promise<ITask[]>
    userTasks(email:string,projectId:string|null):Promise<ITask[]>
    addComment(taskId:string,commentData:IComments):Promise<ITask|null>
    addAdminComment(taskId:string,commentData:IComments):Promise<ITask|null>
    deleteComment(id:string):Promise<IComments|null>
    deleteUserComment(id:string):Promise<IComments|null>
    assignedStatus(taskId:string,acceptanceStatus:string):Promise<ITask|null>
    getSearchResults(query:string,projectId:string):Promise<ITask[]>
}