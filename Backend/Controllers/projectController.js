"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const axios_1 = require("axios");
const handleError_1 = require("../Utils/handleError");
class ProjectController {
    constructor(projectService) {
        this.createProject = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const projectData = req.body;
                const serviceResponse = await this.projectService.createProject(admin_id, projectData);
                res.status(200).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getProjects = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.projectService.getProjects(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getAdminProjects = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.projectService.getAdminProjects(admin_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.updateProject = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const projectData = req.body;
                const serviceResponse = await this.projectService.updateProject(admin_id, projectData);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.deleteProject = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const projectId = req.body.projectId;
                console.log("project", projectId);
                const serviceResponse = await this.projectService.deleteProject(admin_id, projectId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.projectMembers = async (req, res) => {
            try {
                const projectId = req.query.projectId;
                const serviceResponse = await this.projectService.projectMembers(projectId);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
            }
        };
        this.chatProjects = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.projectService.chatProjects(user_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.AdminchatProjects = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.projectService.AdminchatProjects(admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getSelectedProject = async (req, res) => {
            try {
                const project = req.body.project;
                const serviceResponse = await this.projectService.getSelectedProject(project);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                console.log(error);
            }
        };
        this.projectService = projectService;
    }
}
exports.default = ProjectController;
