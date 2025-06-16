import HTTP_statusCode from "../Enums/httpStatusCode";
import { IComments, ITask, IUser } from "../Interfaces/commonInterface";
import { ITaskRepository } from "../Interfaces/task.repository.interface";
import { ITaskService } from "../Interfaces/task.service.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { HttpError } from "../Utils/HttpError";

class TaskServices implements ITaskService {
  private taskRepository: ITaskRepository;
  private userRepository: IUserRepository;
  constructor(
    taskRepository: ITaskRepository,
    userRepository: IUserRepository
  ) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
  }
  taskDetails = async (task: ITask): Promise<ITask> => {
    try {
      return await this.taskRepository.taskDetails(task);
    } catch (error: unknown) {
      throw error;
    }
  };
  editTask = async (task: ITask): Promise<ITask> => {
    try {
      if (!task._id) {
        throw new HttpError(HTTP_statusCode.BadRequest, "No Task ID provided");
      }

      const taskId = task._id;
      const taskDetails: ITask | null = await this.taskRepository.taskFindById(
        taskId
      );

      if (!taskDetails) {
        throw new HttpError(HTTP_statusCode.NotFound, "No task data available");
      }
      if (taskDetails.member == task.member) {
        const updateFields: ITask = {
          admin_id: task.admin_id,
          taskName: task.taskName,
          description: task.description,
          deadline: task.deadline,
          member: task.member,
          projectId: task.projectId,
          comments: task.comments,
        };
        if (task.taskImage) {
          updateFields.taskImage = task.taskImage;
        }
        const taskData: ITask | null = await this.taskRepository.editTask(
          taskId,
          updateFields
        );
        if (!taskData) {
          throw new HttpError(
            HTTP_statusCode.NotFound,
            "Task not found or could not be updated"
          );
        }
        return taskData;
      } else {
        const updateFields: ITask = {
          admin_id: task.admin_id,
          taskName: task.taskName,
          description: task.description,
          deadline: task.deadline,
          member: task.member,
          projectId: task.projectId,
          acceptanceStatus: "unAssigned",
          status: "pending",
          comments: task.comments,
        };
        if (task.taskImage) {
          updateFields.taskImage = task.taskImage;
        }
        const taskData: ITask | null = await this.taskRepository.editTask(
          taskId,
          updateFields
        );
        if (!taskData) {
          throw new HttpError(
            HTTP_statusCode.NotFound,
            "Task not found or could not be updated"
          );
        }
        return taskData;
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  showTask = async (
    user_id: string,
    taskId: string
  ): Promise<ITask | { isAuth: boolean; taskData: ITask }> => {
    try {
      const userData: IUser | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No User Data");
      }
      const taskData = await this.taskRepository.showTask(taskId);
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
      if (userData.email == taskData.member) {
        return taskData;
      } else {
        throw new HttpError(
          HTTP_statusCode.NoAccess,
          "User is not authorized to view this task."
        );
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  updateTaskStatus = async (
    taskId: string,
    status: string,
    projectId: string
  ): Promise<ITask[]> => {
    try {
      const taskData = await this.taskRepository.updateTaskStatus(
        taskId,
        status,
        projectId
      );
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteTask = async (taskId: string): Promise<void> => {
    try {
      const taskData: ITask | null = await this.taskRepository.deleteTask(
        taskId
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  countTask = async (
    user_id: string
  ): Promise<{ pending: number; inProgress: number; completed: number }> => {
    try {
      const taskData = await this.taskRepository.findAllTasks();
      const userData: IUser | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No User Data");
      }
      let pending: number = 0;
      let inProgress: number = 0;
      let completed: number = 0;
      const email: string = userData.email;
      for (const task of taskData) {
        if (task.member == email) {
          if (task.status == "pending") {
            pending++;
          } else if (task.status == "inProgress") {
            inProgress++;
          } else {
            completed++;
          }
        }
      }
      return { pending, inProgress, completed };
    } catch (error: unknown) {
      throw error;
    }
  };
  adminCountTasks = async (
    admin_id: string
  ): Promise<{ pending: number; inProgress: number; completed: number }> => {
    try {
      const taskData: ITask[] = await this.taskRepository.adminCountTasks(
        admin_id
      );
      let pending: number = 0;
      let inProgress: number = 0;
      let completed: number = 0;
      if (taskData?.length) {
        for (const task of taskData) {
          if (task.status == "pending") {
            pending++;
          } else if (task.status == "inProgress") {
            inProgress++;
          } else {
            completed++;
          }
        }
      } else {
        throw new HttpError(HTTP_statusCode.NotFound, "No task Data");
      }
      return { pending, inProgress, completed };
    } catch (error: unknown) {
      throw error;
    }
  };
  adminTasks = async (
    admin_id: string,
    projectId: string | null
  ): Promise<ITask[]> => {
    try {
      const tasks: ITask[] = await this.taskRepository.adminTasks(
        admin_id,
        projectId
      );
      return tasks;
    } catch (error: unknown) {
      throw error;
    }
  };
  userTasks = async (
    user_id: string,
    projectId: string | null
  ): Promise<ITask[]> => {
    try {
      const userData: IUser | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No User Data");
      }
      const email = userData.email;
      const tasks: ITask[] | null = await this.taskRepository.userTasks(
        email,
        projectId
      );
      return tasks;
    } catch (error: unknown) {
      throw error;
    }
  };
  addComment = async (
    taskId: string,
    commentData: IComments
  ): Promise<ITask> => {
    try {
      const taskData: ITask | null = await this.taskRepository.addComment(
        taskId,
        commentData
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  addAdminComment = async (
    taskId: string,
    commentData: IComments
  ): Promise<ITask> => {
    try {
      const taskData: ITask | null = await this.taskRepository.addAdminComment(
        taskId,
        commentData
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteComment = async (id: string): Promise<IComments> => {
    try {
      console.log("id", id);

      const result: IComments | null = await this.taskRepository.deleteComment(
        id
      );
      if (!result) {
        throw new Error("No comment has been deleted");
      }
      return result;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteUserComment = async (id: string): Promise<IComments> => {
    try {
      const result: IComments | null =
        await this.taskRepository.deleteUserComment(id);
      if (!result) {
        throw new Error("No comment has been deleted");
      }
      return result;
    } catch (error: unknown) {
      throw error;
    }
  };
  assignedStatus = async (
    taskId: string,
    acceptanceStatus: string
  ): Promise<ITask> => {
    try {
      const taskData: ITask | null = await this.taskRepository.assignedStatus(
        taskId,
        acceptanceStatus
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getSearchResults = async (
    query: string,
    projectId: string
  ): Promise<ITask[]> => {
    try {
      const searchResults: ITask[] = await this.taskRepository.getSearchResults(
        query,
        projectId
      );
      return searchResults;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default TaskServices;
