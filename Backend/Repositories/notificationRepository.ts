import { Model } from "mongoose";
import { INotificationRepository } from "../Interfaces/notification.repository.interface";
import { INotification } from "../Interfaces/commonInterface";
class NotificationRepository implements INotificationRepository {
  private notificationModel = Model<INotification>;
  constructor(notificationModel: Model<INotification>) {
    this.notificationModel = notificationModel;
  }
  saveNotification = async (
    notificationDetails: INotification
  ): Promise<INotification> => {
    try {
      const notificationData: INotification =
        await this.notificationModel.create(notificationDetails);
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotifications = async (user_id: string): Promise<INotification[]> => {
    try {
      await this.notificationModel.updateMany(
        { assignedUserId: user_id },
        {
          $set: { isRead: true },
        },
        { new: true }
      );
      const notification: INotification[] = await this.notificationModel
        .find({ assignedUserId: user_id, notificationType: "User" })
        .sort({ createdAt: -1 });
      return notification;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminNotifications = async (
    admin_id: string
  ): Promise<INotification[]> => {
    try {
      const notificationData = await this.notificationModel.updateMany(
        { admin_id: admin_id, notificationType: "Admin" },
        {
          $set: { isRead: true },
        },
        { new: true }
      );

      const notification: INotification[] = await this.notificationModel
        .find({ admin_id: admin_id, notificationType: "Admin" })
        .sort({ createdAt: -1 });
      return notification;
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotificationsCount = async (user_id: string): Promise<INotification[]> => {
    try {
      const notification: INotification[] = await this.notificationModel
        .find({ assignedUserId: user_id, notificationType: "User" })
        .sort({ createdAt: -1 });
      return notification;
    } catch (error: unknown) {
      throw error;
    }
  };
  adminNotificationsCount = async (
    admin_id: string
  ): Promise<INotification[]> => {
    try {
      const notification: INotification[] = await this.notificationModel
        .find({ admin_id: admin_id, notificationType: "Admin" })
        .sort({ createdAt: -1 });
      return notification;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default NotificationRepository;
