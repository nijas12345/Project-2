"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class TaskRepository extends baseRepository_1.default {
    constructor(taskModel) {
        super(taskModel);
        this.taskModel = (mongoose_1.Model);
        this.taskFindById = async (taskId) => {
            try {
                return await this.findById(taskId);
            }
            catch (error) {
                throw error;
            }
        };
        this.taskDetails = async (task) => {
            try {
                return await this.createData(task);
            }
            catch (error) {
                throw error;
            }
        };
        this.editTask = async (taskId, updateFields) => {
            try {
                return await this.taskModel.findByIdAndUpdate(taskId, { $set: updateFields }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.showTask = async (taskId) => {
            try {
                return await this.findOne({ _id: taskId });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateTaskStatus = async (taskId, status, projectId) => {
            try {
                const taskData = await this.findByIdAndUpdate(taskId, {
                    status
                }, { new: true });
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No Task Data found");
                }
                if (!projectId) {
                    const tasks = await this.taskModel
                        .find({
                        member: taskData.member,
                        acceptanceStatus: "active",
                    })
                        .sort({
                        createdAt: -1,
                    });
                    return tasks;
                }
                else {
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
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteTask = async (taskId) => {
            try {
                return await this.taskModel.findByIdAndDelete(taskId);
            }
            catch (error) {
                throw error;
            }
        };
        this.findAllTasks = async () => {
            try {
                return await this.findAll();
            }
            catch (error) {
                throw error;
            }
        };
        this.adminCountTasks = async (admin_id) => {
            try {
                return await this.findAll({
                    admin_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.adminTasks = async (admin_id, projectId) => {
            try {
                if (projectId == "unassigned") {
                    return await this.taskModel.find({
                        admin_id: admin_id,
                        acceptanceStatus: "unAssigned",
                    });
                }
                else if (projectId == "reassigned") {
                    return await this.findAll({
                        admin_id: admin_id,
                        acceptanceStatus: "reAssigned",
                    });
                }
                else if (!projectId) {
                    return await this.findAll({
                        admin_id: admin_id,
                        acceptanceStatus: "active",
                    });
                }
                else {
                    return await this.taskModel.find({
                        projectId: projectId,
                        acceptanceStatus: "active",
                    });
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.userTasks = async (email, projectId) => {
            try {
                if (projectId == "unassigned") {
                    return await this.findAll({
                        member: email.trim(),
                        acceptanceStatus: "unAssigned",
                    });
                }
                else if (!projectId) {
                    return await this.taskModel
                        .find({
                        member: email,
                        acceptanceStatus: "active",
                    })
                        .sort({
                        acceptanceStatus: -1,
                        createdAt: -1,
                    });
                }
                else if (projectId == "me") {
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
                else {
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
            }
            catch (error) {
                throw error;
            }
        };
        this.addComment = async (taskId, commentData) => {
            try {
                return await this.findOneAndUpdate({ _id: taskId }, { $push: { comments: commentData } });
            }
            catch (error) {
                throw error;
            }
        };
        this.addAdminComment = async (taskId, commentData) => {
            try {
                const taskData = await this.findOneAndUpdate({ _id: taskId }, { $push: { comments: commentData } });
                return taskData;
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteComment = async (id) => {
            try {
                return await this.taskModel.findOneAndUpdate({ "comments._id": id }, {
                    $pull: {
                        comments: { _id: id },
                    },
                }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteUserComment = async (id) => {
            try {
                return await this.taskModel.findOneAndUpdate({ "comments._id": id }, {
                    $pull: {
                        comments: { _id: id },
                    },
                }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.assignedStatus = async (taskId, acceptanceStatus) => {
            try {
                const taskData = await this.findByIdAndUpdate(taskId, {
                    acceptanceStatus: acceptanceStatus,
                }, { new: true });
                if (acceptanceStatus == "reAssigned") {
                    await this.taskModel.findByIdAndUpdate(taskId, {
                        member: "",
                    });
                }
                return taskData;
            }
            catch (error) {
                throw error;
            }
        };
        this.getSearchResults = async (query, projectId) => {
            try {
                if (projectId === "unassigned") {
                    const searchResults = await this.findAll({
                        taskName: { $regex: query, $options: "i" },
                        acceptanceStatus: "unAssigned",
                    });
                    console.log("searchR", searchResults);
                    return searchResults;
                }
                else if (projectId == "reassigned") {
                    const searchResults = await this.findAll({
                        taskName: { $regex: query, $options: "i" },
                        acceptanceStatus: "reAssigned",
                    });
                    return searchResults;
                }
                else if (projectId.length > 14) {
                    const searchResults = await this.findAll({
                        taskName: { $regex: query, $options: "i" },
                        projectId: projectId,
                        acceptanceStatus: "active",
                    });
                    return searchResults;
                }
                else {
                    const searchResults = await this.findAll({
                        taskName: { $regex: query, $options: "i" },
                        acceptanceStatus: "active",
                    });
                    return searchResults;
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteTaskByProjectId = async (projectId) => {
            try {
                await this.taskModel.deleteMany({ projectId: projectId });
            }
            catch (error) {
                throw error;
            }
        };
        this.taskModel = taskModel;
    }
}
exports.default = TaskRepository;
