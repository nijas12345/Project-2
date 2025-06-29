"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class ChatRepository extends baseRepository_1.default {
    constructor(chatModel) {
        super(chatModel);
        this.chatModel = (mongoose_1.Model);
        this.getChats = async (projectId, pageNumber, limitNumber) => {
            try {
                const chatData = await this.chatModel
                    .find({ projectId: projectId })
                    .sort({ _id: -1 })
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber);
                const sortedChatData = chatData.reverse(); // Reverse to chronological order
                return sortedChatData;
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminChats = async (projectId, pageNumber, limitNumber) => {
            try {
                const chatData = await this.chatModel
                    .find({ projectId: projectId })
                    .sort({ _id: -1 }) // Get newest chats first
                    .skip((pageNumber - 1) * limitNumber) // Pagination logic
                    .limit(limitNumber); // Use limitNumber parameter
                const sortedChatData = chatData; // Reverse to chronological order
                return sortedChatData;
            }
            catch (error) {
                throw error;
            }
        };
        this.saveChats = async (messageDetails) => {
            try {
                return this.createData(messageDetails);
            }
            catch (error) {
                throw error;
            }
        };
        this.saveFiles = async (messageWithFile) => {
            try {
                // delete messageWithFile._id;
                return await this.createData(messageWithFile);
            }
            catch (error) {
                throw error;
            }
        };
        this.deleteChatByProjectId = async (projectId) => {
            try {
                await this.chatModel.deleteMany({ projectId: projectId });
            }
            catch (error) {
                throw error;
            }
        };
        this.findLatestProjectsByMessage = async (combinedProjects) => {
            try {
                const sortedProjects = await Promise.all(combinedProjects.map(async (project) => {
                    const latestMessage = await this.chatModel
                        .findOne({ projectId: project._id })
                        .sort({ sentAt: -1 })
                        .lean();
                    return {
                        ...project, // Spread the current project details
                        latestMessage, // Attach the latest message
                    };
                }));
                sortedProjects.sort((a, b) => {
                    const dateA = a.latestMessage?.sentAt
                        ? new Date(a.latestMessage.sentAt).getTime()
                        : 0;
                    const dateB = b.latestMessage?.sentAt
                        ? new Date(b.latestMessage.sentAt).getTime()
                        : 0;
                    return dateB - dateA; // Descending order
                });
                return sortedProjects;
            }
            catch (error) {
                throw error;
            }
        };
        this.chatModel = chatModel;
    }
}
exports.default = ChatRepository;
