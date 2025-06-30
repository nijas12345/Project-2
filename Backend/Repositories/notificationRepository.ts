import { Model } from "mongoose";
import { INotificationRepository } from "../Interfaces/notification.repository.interface";
import BaseRepository from "./base/baseRepository";
import { NotificationDoc, NotificationInput } from "../Model/notificationModal";
class NotificationRepository
  extends BaseRepository<NotificationDoc>
  implements INotificationRepository
{
  private notificationModel = Model<NotificationDoc>;
  constructor(notificationModel: Model<NotificationDoc>) {
    super(notificationModel);
    this.notificationModel = notificationModel;
  }
  saveNotification = async (
    notificationDetails: NotificationInput
  ): Promise<NotificationDoc> => {
    try {
      return await this.createData(notificationDetails);
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotifications = async (user_id: string): Promise<NotificationDoc[]> => {
    try {
      await this.notificationModel.updateMany(
        { assignedUserId: user_id },
        {
          $set: { isRead: true },
        },
        { new: true }
      );
      return await this.notificationModel
        .find({ assignedUserId: user_id, notificationType: "User" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminNotifications = async (
    admin_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      await this.notificationModel.updateMany(
        { admin_id: admin_id, notificationType: "Admin" },
        {
          $set: { isRead: true },
        },
        { new: true }
      );

      return await this.notificationModel
        .find({ admin_id: admin_id, notificationType: "Admin" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotificationsCount = async (
    user_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      return await this.notificationModel
        .find({ assignedUserId: user_id, notificationType: "User" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  adminNotificationsCount = async (
    admin_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      return await this.notificationModel
        .find({ admin_id: admin_id, notificationType: "Admin" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default NotificationRepository;
