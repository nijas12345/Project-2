"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatServices {
    constructor(chatRepository) {
        this.getChats = async (projectId, pageNumber, limitNumber) => {
            try {
                const chats = await this.chatRepository.getChats(projectId, pageNumber, limitNumber);
                return chats;
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminChats = async (projectId, pageNumber, limitNumber) => {
            try {
                const chats = await this.chatRepository.getChats(projectId, pageNumber, limitNumber);
                return chats;
            }
            catch (error) {
                throw error;
            }
        };
        this.saveChats = async (messageDetails) => {
            try {
                const chats = await this.chatRepository.saveChats(messageDetails);
                return chats;
            }
            catch (error) {
                throw error;
            }
        };
        this.saveFiles = async (messageWithFile) => {
            try {
                const chats = await this.chatRepository.saveFiles(messageWithFile);
                return chats;
            }
            catch (error) {
                throw error;
            }
        };
        this.chatRepository = chatRepository;
    }
}
exports.default = ChatServices;
