"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class ProjectRepository extends baseRepository_1.default {
    constructor(projectModel) {
        super(projectModel);
        this.projectModel = (mongoose_1.Model);
        this.createProject = async (project) => {
            try {
                return await this.createData(project);
            }
            catch (error) {
                throw error;
            }
        };
        this.existingProjectByAdminId = async (admin_id) => {
            try {
                return await this.findAll({
                    admin_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.getProjects = async (email) => {
            try {
                return await this.projectModel
                    .find({
                    members: { $elemMatch: { email: email } },
                })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminProjects = async (admin_id) => {
            try {
                return await this.projectModel
                    .find({ admin_id: admin_id })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        };
        this.getMeetings = async (email) => {
            try {
                return await this.findAll({
                    "members.email": email,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminMeetings = async (admin_id) => {
            try {
                return await this.findAll({
                    admin_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.findProjectById = async (projectId) => {
            try {
                return await this.projectModel.findById(projectId);
            }
            catch (error) {
                throw error;
            }
        };
        this.updateProject = async (admin_id, projectId, name, description, members) => {
            try {
                const updateProject = {
                    admin_id,
                    name,
                    description,
                    members
                };
                await this.findOneAndUpdate({ _id: projectId }, {
                    $set: updateProject,
                });
                return await this.projectModel
                    .find({ admin_id: admin_id })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        };
        this.projectMembers = async (projectId) => {
            try {
                return await this.findOne({
                    _id: projectId,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteProject = async (admin_id, projectId) => {
            try {
                await this.deleteOne({ _id: projectId });
                return await this.projectModel.find({
                    admin_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.combinedProjects = async (user_id, userEmail) => {
            try {
                return await this.projectModel.find({
                    $or: [{ "members.email": userEmail }, { user_id: user_id }],
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.combinedAdminProjects = async (admin_id) => {
            try {
                return await this.projectModel.find({
                    admin_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.countProjectDocuments = async (admin_id) => {
            try {
                return await this.projectModel.countDocuments({
                    admin_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.projectModel = projectModel;
    }
}
exports.default = ProjectRepository;
