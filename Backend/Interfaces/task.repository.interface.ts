import { Types } from "mongoose"
import { CommentDoc, CommentInput, TaskDoc, TaskInput } from "../Model/taskModal"

export interface ITaskRepository {
    taskFindById(taskId:Types.ObjectId):Promise<TaskDoc|null>
    taskDetails(taskDetails:TaskInput):Promise<TaskDoc>
    showTask(taskId:string):Promise<TaskDoc|null>
    updateTaskStatus(taskId:string,status:string,projectId:string):Promise<TaskDoc[]>
    deleteTask(taskId:string):Promise<TaskDoc|null>
    deleteTaskByProjectId(projectId:string):Promise<void>
    findAllTasks():Promise<TaskDoc[]>
    adminCountTasks(user_id:string):Promise<TaskDoc[]>
    editTask(taskId:Types.ObjectId,updateFields:TaskInput):Promise<TaskDoc|null>
    adminTasks(admin_id:string,projectId:string|null):Promise<TaskDoc[]>
    userTasks(email:string,projectId:string|null):Promise<TaskDoc[]>
    addComment(taskId:string,commentData:CommentInput):Promise<TaskDoc|null>
    addAdminComment(taskId:string,commentData:CommentInput):Promise<TaskDoc|null>
    deleteComment(id:string):Promise<CommentDoc|null>
    deleteUserComment(id:string):Promise<CommentDoc|null>
    assignedStatus(taskId:string,acceptanceStatus:string):Promise<TaskDoc|null>
    getSearchResults(admin_id:string,query:string,projectId:string):Promise<TaskDoc[]>
}