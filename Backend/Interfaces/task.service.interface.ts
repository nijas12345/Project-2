import { CommentDoc, CommentInput, TaskDoc, TaskInput } from "../Model/taskModal"

export interface ITaskService {
    taskDetails(taskDetails:TaskInput):Promise<TaskDoc>
    showTask(user_id:string,taskId:string):Promise<TaskDoc|{isAuth:boolean,taskData:TaskDoc}>
    updateTaskStatus(taskId:string,status:string,projectId:string):Promise<TaskDoc[]>
    deleteTask(taskId:string):Promise<void>
    countTask(user_id:string):Promise<{pending:number,inProgress:number,completed:number}>
    adminCountTasks(admin_id:string):Promise<{pending:number,inProgress:number,completed:number}>
    editTask(task:TaskDoc):Promise<TaskDoc>
    adminTasks(admin_id:string,projectId:string|null):Promise<TaskDoc[]>
    userTasks(user_id:string,projectId:string|null):Promise<TaskDoc[]>
    addComment(taskId:string,commentData:CommentInput):Promise<TaskDoc>
    addAdminComment(taskId:string,commentData:CommentInput):Promise<TaskDoc>
    deleteComment(id:string):Promise<CommentDoc>
    deleteUserComment(id:string):Promise<CommentDoc>
    assignedStatus(taskId:string,acceptanceStatus:string):Promise<TaskDoc>
    getSearchResults(admin_id:string,query:string,projectId:string):Promise<TaskDoc[]>
}