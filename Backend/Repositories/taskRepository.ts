import { Model, Types } from "mongoose";
import { ITaskRepository } from "../Interfaces/task.repository.interface";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import {
  CommentDoc,
  CommentInput,
  TaskDoc,
  TaskInput,
} from "../Model/taskModal";
import BaseRepository from "./base/baseRepository";

class TaskRepository
  extends BaseRepository<TaskDoc>
  implements ITaskRepository
{
  private taskModel = Model<TaskDoc>;
  constructor(taskModel: Model<TaskDoc>) {
    super(taskModel);
    this.taskModel = taskModel;
  }
  taskFindById = async (taskId: Types.ObjectId): Promise<TaskDoc | null> => {
    try {
      return await this.findById(taskId);
    } catch (error: unknown) {
      throw error;
    }
  };
  taskDetails = async (task: TaskInput): Promise<TaskDoc> => {
    try {
      return await this.createData(task);
    } catch (error: unknown) {
      throw error;
    }
  };
  editTask = async (
    taskId: Types.ObjectId,
    updateFields: TaskInput
  ): Promise<TaskDoc | null> => {
    try {
      return await this.taskModel.findByIdAndUpdate(
        taskId,
        { $set: updateFields },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  showTask = async (taskId: string): Promise<TaskDoc | null> => {
    try {
      return await this.findOne({ _id: taskId });
    } catch (error: unknown) {
      throw error;
    }
  };
  updateTaskStatus = async (
    taskId: string,
    status: string,
    projectId: string
  ): Promise<TaskDoc[]> => {
    try {
      const taskData: TaskDoc | null = await this.findByIdAndUpdate(
        taskId,
        {
          status,
        },
        { new: true }
      );

      if (!taskData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No Task Data found");
      }
      if (!projectId) {
        const tasks: TaskDoc[] = await this.taskModel
          .find({
            member: taskData.member,
            acceptanceStatus: "active",
          })
          .sort({
            createdAt: -1,
          });
        return tasks;
      } else {
        return await this.taskModel
          .find({
            member: taskData.member,
            acceptanceStatus: "active",
            projectId: taskData.projectId,
          })
          .sort({
            createdAt: -1,
          });
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteTask = async (taskId: string): Promise<TaskDoc | null> => {
    try {
      return await this.taskModel.findByIdAndDelete(taskId);
    } catch (error: unknown) {
      throw error;
    }
  };
  findAllTasks = async (): Promise<TaskDoc[]> => {
    try {
      return await this.findAll();
    } catch (error: unknown) {
      throw error;
    }
  };
  adminCountTasks = async (admin_id: string): Promise<TaskDoc[]> => {
    try {
      return await this.findAll({
        admin_id,
      });
    } catch (error) {
      throw error;
    }
  };
  adminTasks = async (
    admin_id: string,
    projectId: string | null
  ): Promise<TaskDoc[]> => {
    try {
      if (projectId == "unassigned") {
        return await this.taskModel.find({
          admin_id: admin_id,
          acceptanceStatus: "unAssigned",
        });
      } else if (projectId == "reassigned") {
        return await this.findAll({
          admin_id: admin_id,
          acceptanceStatus: "reAssigned",
        });
      } else if (!projectId) {
        return await this.findAll({
          admin_id: admin_id,
          acceptanceStatus: "active",
        });
      } else {
        return await this.taskModel.find({
          projectId: projectId,
          acceptanceStatus: "active",
        });
      }
    } catch (error) {
      throw error;
    }
  };
  userTasks = async (
    email: string,
    projectId: string | null
  ): Promise<TaskDoc[]> => {
    try {
      if (projectId == "unassigned") {
        return await this.findAll({
          member: email.trim(),
          acceptanceStatus: "unAssigned",
        });
      } else if (!projectId) {
        return await this.taskModel
          .find({
            member: email,
            acceptanceStatus: "active",
          })
          .sort({
            acceptanceStatus: -1,
            createdAt: -1,
          });
      } else if (projectId == "me") {
        return await this.taskModel
          .find({
            member: email,
            projectId: projectId,
            acceptanceStatus: "active",
          })
          .sort({
            createdAt: -1,
          });
      } else {
        return await this.taskModel
          .find({
            member: email,
            projectId: projectId,
            acceptanceStatus: "active",
          })
          .sort({
            createdAt: -1,
          });
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  addComment = async (
    taskId: string,
    commentData: CommentInput
  ): Promise<TaskDoc | null> => {
    try {
      return await this.findOneAndUpdate(
        { _id: taskId },
        { $push: { comments: commentData } }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  addAdminComment = async (
    taskId: string,
    commentData: CommentInput
  ): Promise<TaskDoc | null> => {
    try {
      const taskData: TaskDoc | null = await this.findOneAndUpdate(
        { _id: taskId },
        { $push: { comments: commentData } }
      );
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteComment = async (id: string): Promise<CommentDoc | null> => {
    try {
      return await this.taskModel.findOneAndUpdate(
        { "comments._id": id },
        {
          $pull: {
            comments: { _id: id },
          },
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteUserComment = async (id: string): Promise<CommentDoc | null> => {
    try {
      return await this.taskModel.findOneAndUpdate(
        { "comments._id": id },
        {
          $pull: {
            comments: { _id: id },
          },
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  assignedStatus = async (
    taskId: string,
    acceptanceStatus: string
  ): Promise<TaskDoc | null> => {
    try {
      const taskData: TaskDoc | null = await this.findByIdAndUpdate(
        taskId,
        {
          acceptanceStatus: acceptanceStatus,
        },
        { new: true }
      );
      if (acceptanceStatus == "reAssigned") {
        await this.taskModel.findByIdAndUpdate(taskId, {
          member: "",
        });
      }
      return taskData;
    } catch (error) {
      throw error;
    }
  };
  getSearchResults = async (
    admin_id: string,
    query: string,
    projectId: string
  ): Promise<TaskDoc[]> => {
    try {
      console.log("projectId", projectId);

      if (projectId === "unassigned") {
        const searchResults: TaskDoc[] = await this.findAll({
          admin_id,
          taskName: { $regex: query, $options: "i" },
          acceptanceStatus: "unAssigned",
        });
        console.log("searchR", searchResults);

        return searchResults;
      } else if (projectId == "reassigned") {
        const searchResults: TaskDoc[] = await this.findAll({
          admin_id,
          taskName: { $regex: query, $options: "i" },
          acceptanceStatus: "reAssigned",
        });

        return searchResults;
      } else if (projectId.length > 14) {
        const searchResults: TaskDoc[] = await this.findAll({
          admin_id,
          taskName: { $regex: query, $options: "i" },
          projectId: projectId,
          acceptanceStatus: "active",
        });
        return searchResults;
      } else {
        const searchResults: TaskDoc[] = await this.findAll({
          admin_id,
          taskName: { $regex: query, $options: "i" },
          acceptanceStatus: "active",
        });
        return searchResults;
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteTaskByProjectId = async (projectId: string): Promise<void> => {
    try {
      await this.taskModel.deleteMany({ projectId: projectId });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default TaskRepository;
