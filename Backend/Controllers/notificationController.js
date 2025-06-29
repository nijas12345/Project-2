"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const handleError_1 = require("../Utils/handleError");
class NotificationController {
    constructor(notificationService) {
        this.getNotifications = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceRespone = await this.notificationService.getNotifications(user_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceRespone);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getAdminNotifications = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceRespone = await this.notificationService.getAdminNotifications(admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceRespone);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getNotificationsCount = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceRespone = await this.notificationService.getNotificationsCount(user_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceRespone);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.adminNotificationsCount = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceRespone = await this.notificationService.adminNotificationsCount(admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceRespone);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.notificationService = notificationService;
    }
}
exports.default = NotificationController;
