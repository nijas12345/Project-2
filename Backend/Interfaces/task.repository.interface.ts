import { Types } from "mongoose";
import { CommentDoc, CommentInput, TaskDoc, TaskInput } from "../Model/taskModal";

//  Task CRUD operations
export interface ITaskCrudRepository {
  taskDetails(taskDetails: TaskInput): Promise<TaskDoc>;
  editTask(taskId: Types.ObjectId, updateFields: TaskInput): Promise<TaskDoc | null>;
  deleteTask(taskId: string): Promise<TaskDoc | null>;
  deleteTaskByProjectId(projectId: string): Promise<void>;
  findAllTasks(): Promise<TaskDoc[]>;
}

//  Task retrieval and status updates
export interface ITaskQueryRepository {
  taskFindById(taskId: Types.ObjectId): Promise<TaskDoc | null>;
  showTask(taskId: string): Promise<TaskDoc | null>;
  updateTaskStatus(taskId: string, status: string, projectId: string): Promise<TaskDoc[]>;
  assignedStatus(taskId: string, acceptanceStatus: string): Promise<TaskDoc | null>;
  getSearchResults(admin_id: string, query: string, projectId: string): Promise<TaskDoc[]>;
}

//  Task by user/admin
export interface ITaskRoleViewRepository {
  adminTasks(admin_id: string, projectId: string | null): Promise<TaskDoc[]>;
  userTasks(email: string, projectId: string | null): Promise<TaskDoc[]>;
  adminCountTasks(user_id: string): Promise<TaskDoc[]>;
}

//  Comment management
export interface ITaskCommentRepository {
  addComment(taskId: string, commentData: CommentInput): Promise<TaskDoc | null>;
  addAdminComment(taskId: string, commentData: CommentInput): Promise<TaskDoc | null>;
  deleteComment(id: string): Promise<CommentDoc | null>;
  deleteUserComment(id: string): Promise<CommentDoc | null>;
}

//  Final combined interface
export interface ITaskRepository
  extends ITaskCrudRepository,
          ITaskQueryRepository,
          ITaskRoleViewRepository,
          ITaskCommentRepository {}
