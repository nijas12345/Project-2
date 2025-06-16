import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { INotificationService } from "../Interfaces/notification.service.interface";
import { HttpStatusCode } from "axios";
import { handleError } from "../Utils/handleError";

class NotificationController {
  private notificationService: INotificationService;
  constructor(notificationService: INotificationService) {
    this.notificationService = notificationService;
  }
  getNotifications = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const serviceRespone = await this.notificationService.getNotifications(
        user_id
      );
      res.status(HttpStatusCode.Ok).json(serviceRespone);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  getAdminNotifications = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const serviceRespone =
        await this.notificationService.getAdminNotifications(admin_id);
      res.status(HttpStatusCode.Ok).json(serviceRespone);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  getNotificationsCount = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const serviceRespone =
        await this.notificationService.getNotificationsCount(user_id);
      res.status(HttpStatusCode.Ok).json(serviceRespone);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  adminNotificationsCount = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const serviceRespone =
        await this.notificationService.adminNotificationsCount(admin_id);
      res.status(HttpStatusCode.Ok).json(serviceRespone);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}

export default NotificationController;
