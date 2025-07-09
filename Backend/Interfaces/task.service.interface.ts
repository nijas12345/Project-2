import { CommentDoc, CommentInput, TaskDoc, TaskInput } from "../Model/taskModal";

// 🛠️ Core Task Operations
export interface ITaskCoreService {
  taskDetails(taskDetails: TaskInput): Promise<TaskDoc>;
  showTask(user_id: string, taskId: string): Promise<TaskDoc | { isAuth: boolean; taskData: TaskDoc }>;
  editTask(task: TaskDoc): Promise<TaskDoc>;
  deleteTask(taskId: string): Promise<void>;
}

// 🔄 Task Status Handling
export interface ITaskStatusService {
  updateTaskStatus(taskId: string, status: string, projectId: string): Promise<TaskDoc[]>;
  assignedStatus(taskId: string, acceptanceStatus: string): Promise<TaskDoc>;
}

// 📊 Task Count for Dashboard
export interface ITaskCountService {
  countTask(user_id: string): Promise<{ pending: number; inProgress: number; completed: number }>;
  adminCountTasks(admin_id: string): Promise<{ pending: number; inProgress: number; completed: number }>;
}

// 👥 Role-based Task Listing
export interface ITaskRoleViewService {
  adminTasks(admin_id: string, projectId: string | null): Promise<TaskDoc[]>;
  userTasks(user_id: string, projectId: string | null): Promise<TaskDoc[]>;
}

// 💬 Comments Handling
export interface ITaskCommentService {
  addComment(taskId: string, commentData: CommentInput): Promise<TaskDoc>;
  addAdminComment(taskId: string, commentData: CommentInput): Promise<TaskDoc>;
  deleteComment(id: string): Promise<CommentDoc>;
  deleteUserComment(id: string): Promise<CommentDoc>;
}

// 🔍 Task Search
export interface ITaskSearchService {
  getSearchResults(admin_id: string, query: string, projectId: string): Promise<TaskDoc[]>;
}

// ✅ Combined Task Service Interface (Optional)
export interface ITaskService
  extends ITaskCoreService,
          ITaskStatusService,
          ITaskCountService,
          ITaskRoleViewService,
          ITaskCommentService,
          ITaskSearchService {}
