import { Request, Response } from "express";
import { IComments } from "../Interfaces/commonInterface";
import { ITaskService } from "../Interfaces/task.service.interface";
import HTTP_statusCode from "../Enums/httpStatusCode";
import cloudinary from "../Config/cloudinary_config";
import { HttpStatusCode } from "axios";
import fs from "fs/promises";
import { handleError } from "../Utils/handleError";
import { TaskDoc, TaskInput } from "../Model/taskModal";

class TaskController {
  private taskService: ITaskService;
  constructor(taskService: ITaskService) {
    this.taskService = taskService;
  }
  taskDetails = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const file = req.file;
      if (!file) {
        const tasks: TaskInput = {
          admin_id: admin_id,
          taskName: req.body.taskName,
          description: req.body.description,
          member: req.body.assigny,
          deadline: req.body.deadline,
          projectId: req.body.selectedProject,
          comments: req.body.comments,
        };
        const serviceResponse = await this.taskService.taskDetails(tasks);
        res.status(HttpStatusCode.Ok).json(serviceResponse);
      } else {
        const result = await cloudinary.uploader.upload(
          file.path,
          { folder: "uploads" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
            } else {
              console.log("Cloudinary upload result:", result);
            }
          }
        );
        const tasks: TaskInput = {
          admin_id: admin_id,
          taskName: req.body.taskName,
          description: req.body.description,
          member: req.body.assigny,
          taskImage: result.secure_url,
          deadline: req.body.deadline,
          projectId: req.body.selectedProject,
          comments: req.body.comments,
        };
        try {
          await fs.unlink(file.path); // Deletes the file
          console.log("Local file deleted successfully");
        } catch (deleteError) {
          console.error("Error deleting local file:", deleteError);
        }
        const serviceResponse = await this.taskService.taskDetails(tasks);
        res.status(HttpStatusCode.Ok).send(serviceResponse);
      }
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  editTask = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const file = req.file;
      if (!file) {
        const tasks: TaskDoc = {
          admin_id: admin_id,
          _id: req.body.id,
          taskName: req.body.taskName,
          description: req.body.description,
          member: req.body.assigny,
          deadline: req.body.deadline,
          projectId: req.body.selectedProject,
          comments: req.body.comments,
        };
        const serviceResponse = await this.taskService.editTask(tasks);
        res.status(HttpStatusCode.Ok).json(serviceResponse);
      } else {
        const result = await cloudinary.uploader.upload(
          file.path,
          { folder: "uploads" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
            } else {
              console.log("Cloudinary upload result:", result);
            }
          }
        );
        try {
          await fs.unlink(file.path); // Deletes the file
          console.log("Local file deleted successfully");
        } catch (deleteError) {
          console.error("Error deleting local file:", deleteError);
        }
        const tasks: TaskDoc = {
          admin_id: admin_id,
          _id: req.body.id,
          taskName: req.body.taskName,
          description: req.body.description,
          member: req.body.assigny,
          taskImage: result.secure_url,
          deadline: req.body.deadline,
          projectId: req.body.selectedProject,
          comments: req.body.comments,
        };
        const serviceResponse = await this.taskService.editTask(tasks);
        res.status(HttpStatusCode.Ok).json(serviceResponse);
      }
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  showTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const taskId = req.body.taskId;
      const serviceResponse = await this.taskService.showTask(user_id, taskId);

      res.status(HttpStatusCode.Ok).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const projectId = req.body.projectId as string;

      const taskId = req.body.taskId as string;
      const status = req.body.status as string;
      const serviceResponse = await this.taskService.updateTaskStatus(
        taskId,
        status,
        projectId
      );
      res.status(HttpStatusCode.Ok).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  deleteTask = async (req: Request, res: Response) => {
    try {
      const taskId = req.body.taskId as string;
      await this.taskService.deleteTask(taskId);
      res.status(HttpStatusCode.Ok).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  countTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const serviceResponse = await this.taskService.countTask(user_id);
      res.status(HttpStatusCode.Ok).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  adminCountTasks = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const serviceResponse = await this.taskService.adminCountTasks(admin_id);
      res.status(HttpStatusCode.Ok).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  adminTasks = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const { projectId } = req.body;
      const serviceResponse = await this.taskService.adminTasks(
        admin_id,
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  userTasks = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const { projectId } = req.body;

      const serviceResponse = await this.taskService.userTasks(
        user_id,
        projectId
      );

      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  addAdminComment = async (req: Request, res: Response) => {
    try {
      const taskId = req.body.taskId as string;
      const commentData: IComments = req.body.commentData;
      const serviceResponse = await this.taskService.addAdminComment(
        taskId,
        commentData
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  addComment = async (req: Request, res: Response) => {
    try {
      const taskId = req.body.taskId as string;
      const commentData: IComments = req.body.commentData;
      const serviceResponse = await this.taskService.addComment(
        taskId,
        commentData
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  deleteComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const serviceResponse = await this.taskService.deleteComment(id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  deleteUserComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const serviceResponse = await this.taskService.deleteUserComment(id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  assignedStatus = async (req: Request, res: Response) => {
    try {
      const { taskId, acceptanceStatus } = req.body;
      const serviceResponse = await this.taskService.assignedStatus(
        taskId,
        acceptanceStatus
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  getSearchResults = async (req: Request, res: Response) => {
    try {
      const query = req.query.query as string;
      const projectId = req.query.projectId as string;

      const serviceResponse = await this.taskService.getSearchResults(
        query,
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}

export default TaskController;
