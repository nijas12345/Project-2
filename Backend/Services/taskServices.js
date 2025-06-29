"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const HttpError_1 = require("../Utils/HttpError");
class TaskServices {
    constructor(taskRepository, userRepository) {
        this.taskDetails = async (task) => {
            try {
                return await this.taskRepository.taskDetails(task);
            }
            catch (error) {
                throw error;
            }
        };
        this.editTask = async (task) => {
            try {
                if (!task._id) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No Task ID provided");
                }
                const taskId = task._id;
                const taskDetails = await this.taskRepository.taskFindById(taskId);
                if (!taskDetails) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No task data available");
                }
                if (taskDetails.member == task.member) {
                    const updateFields = {
                        _id: task._id,
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
                    const taskData = await this.taskRepository.editTask(taskId, updateFields);
                    if (!taskData) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                    }
                    return taskData;
                }
                else {
                    const updateFields = {
                        _id: task._id,
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
                    const taskData = await this.taskRepository.editTask(taskId, updateFields);
                    if (!taskData) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                    }
                    return taskData;
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.showTask = async (user_id, taskId) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No User Data");
                }
                const taskData = await this.taskRepository.showTask(taskId);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                }
                if (userData.email == taskData.member) {
                    return taskData;
                }
                else {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NoAccess, "User is not authorized to view this task.");
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.updateTaskStatus = async (taskId, status, projectId) => {
            try {
                const taskData = await this.taskRepository.updateTaskStatus(taskId, status, projectId);
                return taskData;
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteTask = async (taskId) => {
            try {
                const taskData = await this.taskRepository.deleteTask(taskId);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.countTask = async (user_id) => {
            try {
                const taskData = await this.taskRepository.findAllTasks();
                const userData = await this.userRepository.findByUserId(user_id);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                }
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No User Data");
                }
                let pending = 0;
                let inProgress = 0;
                let completed = 0;
                const email = userData.email;
                for (const task of taskData) {
                    if (task.member == email) {
                        if (task.status == "pending") {
                            pending++;
                        }
                        else if (task.status == "inProgress") {
                            inProgress++;
                        }
                        else {
                            completed++;
                        }
                    }
                }
                return { pending, inProgress, completed };
            }
            catch (error) {
                throw error;
            }
        };
        this.adminCountTasks = async (admin_id) => {
            try {
                const taskData = await this.taskRepository.adminCountTasks(admin_id);
                let pending = 0;
                let inProgress = 0;
                let completed = 0;
                if (taskData?.length) {
                    for (const task of taskData) {
                        if (task.status == "pending") {
                            pending++;
                        }
                        else if (task.status == "inProgress") {
                            inProgress++;
                        }
                        else {
                            completed++;
                        }
                    }
                }
                else {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No task Data");
                }
                return { pending, inProgress, completed };
            }
            catch (error) {
                throw error;
            }
        };
        this.adminTasks = async (admin_id, projectId) => {
            try {
                const tasks = await this.taskRepository.adminTasks(admin_id, projectId);
                return tasks;
            }
            catch (error) {
                throw error;
            }
        };
        this.userTasks = async (user_id, projectId) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No User Data");
                }
                const email = userData.email;
                const tasks = await this.taskRepository.userTasks(email, projectId);
                return tasks;
            }
            catch (error) {
                throw error;
            }
        };
        this.addComment = async (taskId, commentData) => {
            try {
                const taskData = await this.taskRepository.addComment(taskId, commentData);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                }
                return taskData;
            }
            catch (error) {
                throw error;
            }
        };
        this.addAdminComment = async (taskId, commentData) => {
            try {
                const taskData = await this.taskRepository.addAdminComment(taskId, commentData);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                }
                return taskData;
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteComment = async (id) => {
            try {
                const result = await this.taskRepository.deleteComment(id);
                if (!result) {
                    throw new Error("No comment has been deleted");
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteUserComment = async (id) => {
            try {
                const result = await this.taskRepository.deleteUserComment(id);
                if (!result) {
                    throw new Error("No comment has been deleted");
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        this.assignedStatus = async (taskId, acceptanceStatus) => {
            try {
                const taskData = await this.taskRepository.assignedStatus(taskId, acceptanceStatus);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Task not found or could not be updated");
                }
                return taskData;
            }
            catch (error) {
                throw error;
            }
        };
        this.getSearchResults = async (query, projectId) => {
            try {
                const searchResults = await this.taskRepository.getSearchResults(query, projectId);
                return searchResults;
            }
            catch (error) {
                throw error;
            }
        };
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
}
exports.default = TaskServices;
