"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class NotificationService {
    constructor(notificationRepository, adminRepository, userRepository, taskRepository) {
        this.saveNotification = async (notificationDetails) => {
            try {
                console.log(typeof notificationDetails.taskId);
                const admin_id = notificationDetails.admin_id;
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No Admin data found");
                }
                const adminID = adminData.admin_id;
                const adminEmail = adminData.email;
                if (!notificationDetails.taskId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No Notification ObjectId");
                }
                const taskId = notificationDetails.taskId;
                const taskData = await this.taskRepository.taskFindById(new mongoose_1.Types.ObjectId(taskId));
                if (!taskData || !taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No task data found");
                }
                const taskMember = taskData.member;
                const taskMessage = taskData.taskName;
                const assignedUserData = await this.userRepository.findByEmail(taskMember);
                if (!assignedUserData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No assigned members");
                }
                const assignedUserId = assignedUserData.user_id;
                const message = `A new task ${taskMessage} assigned by ${adminEmail}`;
                const notification = {
                    admin_id: adminID,
                    taskId: taskId,
                    message: message,
                    assignedUserId: assignedUserId,
                    notificationType: "User",
                };
                const notificationData = await this.notificationRepository.saveNotification(notification);
                return { message: notificationData.message, assignedUserId };
            }
            catch (error) {
                throw error;
            }
        };
        this.userSaveNotification = async (notificationDetails) => {
            try {
                const user_id = notificationDetails.assignedUserId;
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No user data found");
                }
                const assignedUserId = userData.user_id;
                const userEmail = userData.email;
                const taskId = notificationDetails.taskId;
                const taskData = await this.taskRepository.taskFindById(taskId);
                if (!taskData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No task data found");
                }
                const admin_id = taskData.admin_id;
                const message = notificationDetails.message;
                const notification = {
                    admin_id: admin_id,
                    taskId: taskId,
                    message: message,
                    assignedUserId: assignedUserId,
                    notificationType: "Admin",
                };
                const notificationData = await this.notificationRepository.saveNotification(notification);
                return { message: notificationData.message, admin_id };
            }
            catch (error) {
                throw error;
            }
        };
        this.getNotifications = async (user_id) => {
            try {
                const notificationData = await this.notificationRepository.getNotifications(user_id);
                if (!notificationData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No notifications are available");
                }
                return notificationData;
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminNotifications = async (admin_id) => {
            try {
                const notificationData = await this.notificationRepository.getAdminNotifications(admin_id);
                if (!notificationData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No notifications are available");
                }
                return notificationData;
            }
            catch (error) {
                throw error;
            }
        };
        this.getNotificationsCount = async (user_id) => {
            try {
                const notificationData = await this.notificationRepository.getNotificationsCount(user_id);
                if (!notificationData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No notifications are available");
                }
                return notificationData;
            }
            catch (error) {
                throw error;
            }
        };
        this.adminNotificationsCount = async (admin_id) => {
            try {
                const notificationData = await this.notificationRepository.adminNotificationsCount(admin_id);
                if (!notificationData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No notifications are available");
                }
                return notificationData;
            }
            catch (error) {
                throw error;
            }
        };
        this.notificationRepository = notificationRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }
}
exports.default = NotificationService;
