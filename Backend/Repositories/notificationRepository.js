"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class NotificationRepository extends baseRepository_1.default {
    constructor(notificationModel) {
        super(notificationModel);
        this.notificationModel = (mongoose_1.Model);
        this.saveNotification = async (notificationDetails) => {
            try {
                return await this.createData(notificationDetails);
            }
            catch (error) {
                throw error;
            }
        };
        this.getNotifications = async (user_id) => {
            try {
                await this.notificationModel.updateMany({ assignedUserId: user_id }, {
                    $set: { isRead: true },
                }, { new: true });
                return await this.notificationModel
                    .find({ assignedUserId: user_id, notificationType: "User" })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminNotifications = async (admin_id) => {
            try {
                await this.notificationModel.updateMany({ admin_id: admin_id, notificationType: "Admin" }, {
                    $set: { isRead: true },
                }, { new: true });
                return await this.notificationModel
                    .find({ admin_id: admin_id, notificationType: "Admin" })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        };
        this.getNotificationsCount = async (user_id) => {
            try {
                return await this.notificationModel
                    .find({ assignedUserId: user_id, notificationType: "User" })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        };
        this.adminNotificationsCount = async (admin_id) => {
            try {
                return await this.notificationModel
                    .find({ admin_id: admin_id, notificationType: "Admin" })
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw error;
            }
        };
        this.notificationModel = notificationModel;
    }
}
exports.default = NotificationRepository;
