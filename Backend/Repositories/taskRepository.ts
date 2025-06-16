import { Model, Types } from "mongoose";
import { ITaskRepository } from "../Interfaces/task.repository.interface";
import { IComments, ITask, IUser } from "../Interfaces/commonInterface";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";

class TaskRepository implements ITaskRepository {
  private taskModel = Model<ITask>;
  constructor(
    taskModel: Model<ITask>
  ) {
    this.taskModel = taskModel;
  }
  taskFindById = async(taskId: Types.ObjectId): Promise<ITask | null> => {
    try {
      const taskData: ITask | null = await this.taskModel.findOne({
        _id: taskId,
      });
      return taskData
    } catch (error:unknown) {
      throw error
    }
  }
  taskDetails = async (task: ITask): Promise<ITask> => {
    try {
      const taskData = await this.taskModel.create(task);
      return taskData;
    } catch (error:unknown) {
      throw error;
    }
  };
  editTask = async (taskId:Types.ObjectId,updateFields:ITask): Promise<ITask|null> => {
    try {
        const taskData:ITask|null = await this.taskModel.findByIdAndUpdate(
          { _id: taskId },
          { $set: updateFields },
          { new: true }
        );
        return taskData;
    } catch (error:unknown) {
      throw error
    }
  };  
  showTask = async (
    taskId: string
  ): Promise<ITask|null> => {
    try {
      const task: ITask | null = await this.taskModel.findOne({ _id: taskId });
      return  task 
    } catch(error:unknown) {
      throw error;
    }
  };
  updateTaskStatus = async (
    taskId: string,
    status: string,
    projectId: string
  ): Promise<ITask[]> => {
    try {
      const taskData: ITask | null = await this.taskModel.findByIdAndUpdate(
        { _id: taskId },
        {
          status: status,
        },
        { new: true }
      );

     if (!taskData) {
  throw new HttpError(HTTP_statusCode.NotFound, "No Task Data found");
}
      if (!projectId) {
        const tasks: ITask[] = await this.taskModel
          .find({
            member: taskData.member,
            acceptanceStatus: "active",
          })
          .sort({
            createdAt: -1,
          });
        return tasks;
      } else {
        const tasks: ITask[] = await this.taskModel
          .find({
            member: taskData.member,
            acceptanceStatus: "active",
            projectId: taskData.projectId,
          })
          .sort({
            createdAt: -1,
          });
        return tasks;
      }
    } catch(error:unknown) {
      throw error;
    }
  };
  deleteTask = async (taskId: string): Promise<ITask|null> => {
    try {
      const taskData: ITask | null = await this.taskModel.findByIdAndDelete(
        taskId
      );
      return taskData
    } catch(error:unknown) {
      throw error
    }
  };
  findAllTasks = async (
  ): Promise<ITask[]> => {
    try {
      const taskData: ITask[] = await this.taskModel.find();
      return taskData;
    } catch(error:unknown) {
      throw error
    }
  };
  adminCountTasks = async (admin_id: string): Promise<ITask[]> => {
    try {
      const taskData: ITask[] = await this.taskModel.find({
        admin_id: admin_id,
      });
      return taskData;
    } catch (error) {
      throw error
    }
  };
  adminTasks = async (
    admin_id: string,
    projectId: string | null
  ): Promise<ITask[] > => {
    try {
      if (projectId == "unassigned") {
        const taskData: ITask[]  = await this.taskModel.find({
          admin_id: admin_id,
          acceptanceStatus: "unAssigned",
        });
        return taskData;
      } else if (projectId == "reassigned") {
        const taskData: ITask[] | null = await this.taskModel.find({
          admin_id: admin_id,
          acceptanceStatus: "reAssigned",
        });
        return taskData;
      } else if (!projectId) {
        const taskData: ITask[] | null = await this.taskModel.find({
          admin_id: admin_id,
          acceptanceStatus: "active",
        });
        return taskData;
      } else {
        const taskData: ITask[] | null = await this.taskModel.find({
          projectId: projectId,
          acceptanceStatus: "active",
        });
        console.log("withproject", taskData.length);
        return taskData;
      }
    } catch (error) {
      throw error;
    }
  };
  userTasks = async (
    email: string,
    projectId: string | null
  ): Promise<ITask[] > => {
    try {
      if (projectId == "unassigned") {
        const taskData: ITask[] | null = await this.taskModel.find({
          member: email.trim(),
          acceptanceStatus: "unAssigned",
        });
        return taskData;
      } else if (!projectId) {
        const taskData: ITask[] | null = await this.taskModel
          .find({
            member: email,
            acceptanceStatus: "active",
          })
          .sort({
            acceptanceStatus: -1,
            createdAt: -1,
          });
        return taskData;
      } else if (projectId == "me") {
        const taskData: ITask[] | null = await this.taskModel
          .find({
            member: email,
            projectId: projectId,
            acceptanceStatus: "active",
          })
          .sort({
            createdAt: -1,
          });
        return taskData;
      } else {
        const taskData: ITask[] | null = await this.taskModel
          .find({
            member: email,
            projectId: projectId,
            acceptanceStatus: "active",
          })
          .sort({
            createdAt: -1,
          });
        return taskData;
      }
    } catch (error:unknown) {
      throw error;
    }
  };
  addComment = async (
    taskId: string,
    commentData: IComments
  ): Promise<ITask | null> => {
    try {
      const taskData: ITask | null = await this.taskModel.findOneAndUpdate(
        { _id: taskId },
        { $push: { comments: commentData } },
        { new: true }
      );
      return taskData;
    } catch (error:unknown) {
      throw error;
    }
  };
  addAdminComment = async (
    taskId: string,
    commentData: IComments
  ): Promise<ITask | null> => {
    try {
      const taskData: ITask | null = await this.taskModel.findOneAndUpdate(
        { _id: taskId },
        { $push: { comments: commentData } },
        { new: true }
      );
      return taskData;
    } catch (error:unknown) {
      throw error;
    }
  };
  deleteComment = async (id: string): Promise<IComments | null> => {
    try {
      console.log("id", id);
      const result: IComments | null = await this.taskModel.findOneAndUpdate(
        { "comments._id": id },
        {
          $pull: {
            comments: { _id: id },
          },
        },
        { new: true }
      );

      return result;
    } catch (error) {
      throw error
    }
  };
  deleteUserComment = async (id: string): Promise<IComments | null> => {
    try {
      const result: IComments | null = await this.taskModel.findOneAndUpdate(
        { "comments._id": id },
        {
          $pull: {
            comments: { _id: id },
          },
        },
        { new: true }
      );
      return result;
    } catch (error:unknown) {
      throw error
    }
  };
  assignedStatus = async (
    taskId: string,
    acceptanceStatus: string
  ): Promise<ITask | null> => {
    try {
      const taskData: ITask | null = await this.taskModel.findByIdAndUpdate(
        taskId,
        {
          acceptanceStatus: acceptanceStatus,
        },
        { new: true }
      );
      if (acceptanceStatus == "reAssigned") {
        const taskData = await this.taskModel.findByIdAndUpdate(taskId, {
          member: "",
        });
      }
      return taskData;
    } catch (error) {
      throw error;
    }
  };
  getSearchResults = async (
    query: string,
    projectId: string
  ): Promise<ITask[]> => {
    try {
      if (projectId === "unassigned") {
        const searchResults: ITask[] = await this.taskModel.find({
          taskName: { $regex: query, $options: "i" },
          acceptanceStatus: "unAssigned",
        });
        console.log("searchR", searchResults);

        return searchResults;
      } else if (projectId == "reassigned") {
        const searchResults: ITask[] = await this.taskModel.find({
          taskName: { $regex: query, $options: "i" },
          acceptanceStatus: "reAssigned",
        });
        console.log("searchR", searchResults);

        return searchResults;
      } else if (projectId.length > 14) {
        const searchResults: ITask[] = await this.taskModel.find({
          taskName: { $regex: query, $options: "i" },
          projectId: projectId,
          acceptanceStatus: "active",
        });
        return searchResults;
      } else {
        const searchResults: ITask[] = await this.taskModel.find({
          taskName: { $regex: query, $options: "i" },
          acceptanceStatus: "active",
        });
        return searchResults;
      }
    } catch (error:unknown) {
      throw error;
    }
  };
  deleteTaskByProjectId = async(projectId: string): Promise<void> => {
    try {
      await this.taskModel.deleteMany({ projectId: projectId });
    } catch (error:unknown) {
      throw error
    }
  }
}

export default TaskRepository;
