import { Request, Response } from "express";
import { IProjectService } from "../Interfaces/project.service.interface";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { handleError } from "../Utils/handleError";
import { ProjectDoc, ProjectInput } from "../Model/projectModal";

class ProjectController {
  private projectService: IProjectService;
  constructor(projectService: IProjectService) {
    this.projectService = projectService;
  }
  createProject = async (req: Request, res: Response) => {
    try {
      const admin_id: string = req.admin_id as string;
      const projectData: ProjectInput = req.body;
      const serviceResponse = await this.projectService.createProject(
        admin_id,
        projectData
      );
      res.status(200).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  getProjects = async (req: Request, res: Response) => {
    try {
      const user_id: string = req.user_id as string;
      const serviceResponse = await this.projectService.getProjects(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  getAdminProjects = async (req: Request, res: Response) => {
    try {
      const admin_id: string = req.admin_id as string;
      const serviceResponse = await this.projectService.getAdminProjects(
        admin_id
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  updateProject = async (req: Request, res: Response) => {
    try {
      const admin_id: string = req.admin_id as string;
      const projectData: ProjectDoc = req.body;
      const serviceResponse = await this.projectService.updateProject(
        admin_id,
        projectData
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  deleteProject = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const projectId = req.body.projectId as string;
      console.log("project", projectId);

      const serviceResponse = await this.projectService.deleteProject(
        admin_id,
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  projectMembers = async (req: Request, res: Response) => {
    try {
      const projectId = req.query.projectId as string;
      const serviceResponse = await this.projectService.projectMembers(
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      
    }
  };
  chatProjects = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const serviceResponse = await this.projectService.chatProjects(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  AdminchatProjects = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const serviceResponse = await this.projectService.AdminchatProjects(
        admin_id
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };

  getSelectedProject = async (req: Request, res: Response) => {
    try {
      const project = req.body.project as ProjectDoc;
      const serviceResponse = await this.projectService.getSelectedProject(
        project
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      console.log(error);
    }
  };
}

export default ProjectController;
