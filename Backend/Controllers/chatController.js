"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const handleError_1 = require("../Utils/handleError");
class ChatController {
    constructor(chatService) {
        this.getChats = async (req, res) => {
            try {
                const projectId = req.params.projectId;
                const pageNumber = parseInt(req.query.page || "1", 10);
                const limitNumber = parseInt(req.query.limit || "5", 10);
                const serviceResponse = await this.chatService.getChats(projectId, pageNumber, limitNumber);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getAdminChats = async (req, res) => {
            try {
                const projectId = req.params.projectId;
                const pageNumber = parseInt(req.query.page || "1", 10);
                const limitNumber = parseInt(req.query.limit || "5", 10);
                const serviceResponse = await this.chatService.getChats(projectId, pageNumber, limitNumber);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.chatService = chatService;
    }
}
exports.default = ChatController;
