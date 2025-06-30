import { INotificationRepository } from "../Interfaces/notification.repository.interface";
import { UserDoc } from "../Model/userModal";
import { TaskDoc } from "../Model/taskModal";
import { INotificationService } from "../Interfaces/notification.service.interface";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { ITaskRepository } from "../Interfaces/task.repository.interface";
import { Types } from "mongoose";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { AdminDoc } from "../Model/adminModal";
import { NotificationDoc, NotificationInput } from "../Model/notificationModal";

class NotificationService implements INotificationService {
  private notificationRepository: INotificationRepository;
  private adminRepository: IAdminRepository;
  private userRepository: IUserRepository;
  private taskRepository: ITaskRepository;
  constructor(
    notificationRepository: INotificationRepository,
    adminRepository: IAdminRepository,
    userRepository: IUserRepository,
    taskRepository: ITaskRepository
  ) {
    this.notificationRepository = notificationRepository;
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.taskRepository = taskRepository;
  }
  saveNotification = async (
    notificationDetails: NotificationInput
  ): Promise<{ message: string; assignedUserId: string }> => {
    try {
      console.log(typeof notificationDetails.taskId);

      const admin_id: string = notificationDetails.admin_id;
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No Admin data found");
      }

      const adminID = adminData.admin_id;
      const adminEmail = adminData.email;

      if (!notificationDetails.taskId) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "No Notification ObjectId"
        );
      }
      const taskId = notificationDetails.taskId;
      const taskData: TaskDoc | null = await this.taskRepository.taskFindById(
        new Types.ObjectId(taskId)
      );
      if (!taskData || !taskData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No task data found");
      }
      const taskMember = taskData.member;
      const taskMessage = taskData.taskName;
      const assignedUserData: UserDoc | null =
        await this.userRepository.findByEmail(taskMember);
      if (!assignedUserData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No assigned members");
      }
      const assignedUserId = assignedUserData.user_id;
      const message = `A new task ${taskMessage} assigned by ${adminEmail}`;
      const notification: NotificationInput = {
        admin_id: adminID,
        taskId: taskId,
        message: message,
        assignedUserId: assignedUserId,
        notificationType: "User",
      };
      const notificationData =
        await this.notificationRepository.saveNotification(notification);
      return { message: notificationData.message, assignedUserId };
    } catch (error: unknown) {
      throw error;
    }
  };
  userSaveNotification = async (
    notificationDetails: NotificationInput
  ): Promise<{ message: string; admin_id: string }> => {
    try {
      const user_id: string = notificationDetails.assignedUserId;
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No user data found");
      }
      const assignedUserId = userData.user_id;
      const userEmail = userData.email;
      const taskId = notificationDetails.taskId;
      const taskData: TaskDoc | null = await this.taskRepository.taskFindById(
        taskId
      );

      if (!taskData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No task data found");
      }
      const admin_id: string = taskData.admin_id;
      const message = notificationDetails.message;
      const notification: NotificationInput = {
        admin_id: admin_id,
        taskId: taskId,
        message: message,
        assignedUserId: assignedUserId,
        notificationType: "Admin",
      };
      const notificationData =
        await this.notificationRepository.saveNotification(notification);
      return { message: notificationData.message, admin_id };
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotifications = async (user_id: string): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.getNotifications(user_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminNotifications = async (
    admin_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.getAdminNotifications(admin_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotificationsCount = async (
    user_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.getNotificationsCount(user_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  adminNotificationsCount = async (
    admin_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.adminNotificationsCount(admin_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default NotificationService;
