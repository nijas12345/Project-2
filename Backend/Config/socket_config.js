"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.configSocketIO = void 0;
const socket_io_1 = require("socket.io");
const userModal_1 = __importDefault(require("../Model/userModal"));
const chatModal_1 = __importDefault(require("../Model/chatModal"));
const taskModal_1 = __importDefault(require("../Model/taskModal"));
const notificationModal_1 = __importDefault(require("../Model/notificationModal"));
const chatServices_1 = __importDefault(require("../Services/chatServices"));
const userRepository_1 = __importDefault(require("../Repositories/userRepository"));
const chatRepository_1 = __importDefault(require("../Repositories/chatRepository"));
const notificationRepository_1 = __importDefault(require("../Repositories/notificationRepository"));
const adminModal_1 = __importDefault(require("../Model/adminModal"));
const cloudinary_config_1 = __importDefault(require("./cloudinary_config"));
const adminRepository_1 = __importDefault(require("../Repositories/adminRepository"));
const taskRepository_1 = __importDefault(require("../Repositories/taskRepository"));
const notificationServices_1 = __importDefault(require("../Services/notificationServices"));
const adminRepository = new adminRepository_1.default(adminModal_1.default);
const userRepository = new userRepository_1.default(userModal_1.default);
const chatRepository = new chatRepository_1.default(chatModal_1.default);
const chatService = new chatServices_1.default(chatRepository);
const taskRepository = new taskRepository_1.default(taskModal_1.default);
const notificationRepository = new notificationRepository_1.default(notificationModal_1.default);
const notificationService = new notificationServices_1.default(notificationRepository, adminRepository, userRepository, taskRepository);
let io;
let onlineUser = {};
let onlineUsers = {};
const configSocketIO = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: ["https://projecx.online", "http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true,
        },
        maxHttpBufferSize: 10 * 1024 * 1024,
    });
    io.on("connection", (socket) => {
        // console.log(`User connected: ${socket.id}`);
        socket.on("userOnline", (userId) => {
            onlineUsers[userId] = socket.id;
            console.log("onlineUsers", onlineUsers);
            console.log("onlineUsers", onlineUsers[userId]);
            console.log(`User ${userId} is online with socket ID ${socket.id}`);
        });
        socket.on("useroffline", (userId) => {
            if (onlineUsers[userId]) {
                delete onlineUsers[userId];
                console.log(`User ${userId} disconnected manually.`);
            }
        });
        // User joins a group chat room based on projectId
        socket.on("joinRoom", ({ userID, projectId }) => {
            const roomName = `project-${projectId}`;
            onlineUser[userID] = socket.id;
            socket.join(roomName);
            io.to(roomName).emit("userJoinedGroup", { userID, projectId });
            console.log(`User ${userID} joined project room: ${roomName}`);
        });
        socket.on("leaveRoom", ({ userID, projectId }) => {
            const roomName = `project-${projectId}`;
            socket.leave(roomName);
            if (onlineUser[userID]) {
                delete onlineUser[userID];
            }
            io.to(roomName).emit("userLeftGroup", { userID, projectId });
            console.log(`User ${userID} left project room: ${roomName}`);
        });
        socket.on("typing", (data) => {
            console.log(`User Typing Event:`, data); // Logs the data object
            const roomName = `project-${data.projectId}`;
            console.log(`Emitting to room: ${roomName}`);
            socket.to(roomName).emit("userTyping", data);
        });
        socket.on("stopTyping", (data) => {
            console.log(`User Stop Typing Event:`, data); // Logs the data object
            const roomName = `project-${data.projectId}`;
            console.log(`Emitting stopTyping to room: ${roomName}`);
            socket.to(roomName).emit("userStopTyping", data);
        });
        socket.on("sendGroupMessage", async (messageDetails) => {
            try {
                const savedMessage = await chatService.saveChats(messageDetails);
                const roomName = `project-${messageDetails.projectId}`;
                socket.join(roomName);
                io.to(roomName).emit("receiveGroupMessage", savedMessage);
            }
            catch (error) {
                console.log(error);
            }
        });
        socket.on("sendGroupMessageWithFile", async (messageWithFile) => {
            try {
                const roomName = `project-${messageWithFile.projectId}`;
                socket.join(roomName);
                if (messageWithFile.imageFile) {
                    const { data, name, type } = messageWithFile.imageFile;
                    const uploadResult = await cloudinary_config_1.default.uploader.upload(data, {
                        folder: "project_files",
                        resource_type: "auto",
                        public_id: name,
                    });
                    messageWithFile.imageFile = {
                        name: name,
                        type: "image/jpeg",
                        url: uploadResult.secure_url,
                    };
                }
                const savedMessage = await chatService.saveFiles(messageWithFile);
                socket.to(roomName).emit("receiveImageFile", savedMessage);
            }
            catch (error) {
                console.log(error);
            }
        });
        // Joining a notification room for a specific project
        socket.on("sendNotification", async (notificationDetails) => {
            console.log(typeof notificationDetails.taskId);
            const savedNotification = await notificationService.saveNotification(notificationDetails);
            const { assignedUserId, message } = savedNotification;
            const socketId = onlineUsers[assignedUserId];
            if (socketId) {
                io.to(socketId).emit("receiveNotification", { message });
                console.log(`Notification sent to user ${assignedUserId}`);
            }
            else {
                console.log(`User ${assignedUserId} is offline`);
            }
        });
        socket.on("userSendNotification", async (notificationDetails) => {
            const savedNotification = await notificationService.userSaveNotification(notificationDetails);
            const { admin_id, message } = savedNotification;
            console.log("admin", admin_id);
            const socketId = onlineUsers[admin_id];
            if (socketId) {
                io.to(socketId).emit("receiveUserNotification", { message });
                console.log(`Notification sent to user ${admin_id}`);
            }
            else {
                console.log(`User ${admin_id} is offline`);
            }
        });
        socket.on("disconnect", () => {
            // Find and remove the user from onlineUser
            const disconnectChatUser = Object.keys(onlineUser).find((userID) => onlineUser[userID] === socket.id);
            if (disconnectChatUser) {
                delete onlineUser[disconnectChatUser];
                io.emit("userDisconnectedChat", { userID: disconnectChatUser });
                console.log(`Chat user ${disconnectChatUser} disconnected.`);
            }
            // Find and remove the user from onlineUsers
            const disconnectHomeUser = Object.keys(onlineUsers).find((userID) => onlineUsers[userID] === socket.id);
            if (disconnectHomeUser) {
                delete onlineUsers[disconnectHomeUser];
                io.emit("userDisconnectedHome", { userID: disconnectHomeUser });
                console.log(`Home user ${disconnectHomeUser} disconnected.`);
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.configSocketIO = configSocketIO;
