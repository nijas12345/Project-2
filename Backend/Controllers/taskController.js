"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const cloudinary_config_1 = __importDefault(require("../Config/cloudinary_config"));
const axios_1 = require("axios");
const promises_1 = __importDefault(require("fs/promises"));
const handleError_1 = require("../Utils/handleError");
class TaskController {
    constructor(taskService) {
        this.taskDetails = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const file = req.file;
                if (!file) {
                    const tasks = {
                        admin_id: admin_id,
                        taskName: req.body.taskName,
                        description: req.body.description,
                        member: req.body.assigny,
                        deadline: req.body.deadline,
                        projectId: req.body.selectedProject,
                        comments: req.body.comments,
                    };
                    const serviceResponse = await this.taskService.taskDetails(tasks);
                    res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
                }
                else {
                    const result = await cloudinary_config_1.default.uploader.upload(file.path, { folder: "uploads" }, (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                        }
                        else {
                            console.log("Cloudinary upload result:", result);
                        }
                    });
                    const tasks = {
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
                        await promises_1.default.unlink(file.path); // Deletes the file
                        console.log("Local file deleted successfully");
                    }
                    catch (deleteError) {
                        console.error("Error deleting local file:", deleteError);
                    }
                    const serviceResponse = await this.taskService.taskDetails(tasks);
                    res.status(axios_1.HttpStatusCode.Ok).send(serviceResponse);
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.editTask = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const file = req.file;
                if (!file) {
                    const tasks = {
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
                    res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
                }
                else {
                    const result = await cloudinary_config_1.default.uploader.upload(file.path, { folder: "uploads" }, (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                        }
                        else {
                            console.log("Cloudinary upload result:", result);
                        }
                    });
                    try {
                        await promises_1.default.unlink(file.path); // Deletes the file
                        console.log("Local file deleted successfully");
                    }
                    catch (deleteError) {
                        console.error("Error deleting local file:", deleteError);
                    }
                    const tasks = {
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
                    res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.showTask = async (req, res) => {
            try {
                const user_id = req.user_id;
                const taskId = req.body.taskId;
                const serviceResponse = await this.taskService.showTask(user_id, taskId);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.updateTaskStatus = async (req, res) => {
            try {
                const projectId = req.body.projectId;
                const taskId = req.body.taskId;
                const status = req.body.status;
                const serviceResponse = await this.taskService.updateTaskStatus(taskId, status, projectId);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.deleteTask = async (req, res) => {
            try {
                const taskId = req.body.taskId;
                await this.taskService.deleteTask(taskId);
                res.status(axios_1.HttpStatusCode.Ok).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.countTask = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.taskService.countTask(user_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.adminCountTasks = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.taskService.adminCountTasks(admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.adminTasks = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const { projectId } = req.body;
                const serviceResponse = await this.taskService.adminTasks(admin_id, projectId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.userTasks = async (req, res) => {
            try {
                const user_id = req.user_id;
                const { projectId } = req.body;
                const serviceResponse = await this.taskService.userTasks(user_id, projectId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.addAdminComment = async (req, res) => {
            try {
                const taskId = req.body.taskId;
                const commentData = req.body.commentData;
                const serviceResponse = await this.taskService.addAdminComment(taskId, commentData);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.addComment = async (req, res) => {
            try {
                const taskId = req.body.taskId;
                const commentData = req.body.commentData;
                const serviceResponse = await this.taskService.addComment(taskId, commentData);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.deleteComment = async (req, res) => {
            try {
                const { id } = req.body;
                const serviceResponse = await this.taskService.deleteComment(id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.deleteUserComment = async (req, res) => {
            try {
                const { id } = req.body;
                const serviceResponse = await this.taskService.deleteUserComment(id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.assignedStatus = async (req, res) => {
            try {
                const { taskId, acceptanceStatus } = req.body;
                const serviceResponse = await this.taskService.assignedStatus(taskId, acceptanceStatus);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getSearchResults = async (req, res) => {
            try {
                const query = req.query.query;
                const projectId = req.query.projectId;
                const serviceResponse = await this.taskService.getSearchResults(query, projectId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.taskService = taskService;
    }
}
exports.default = TaskController;
