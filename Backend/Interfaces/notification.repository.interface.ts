import { NotificationDoc, NotificationInput } from "../Model/notificationModal";

export interface INotificationRepository{
  saveNotification(notification:NotificationInput):Promise<{message:string,assignedUserId:string}>
  getNotifications(user_id:string):Promise<NotificationDoc[]>
  getAdminNotifications(admin_id:string):Promise<NotificationDoc[]>
  getNotificationsCount(user_id:string):Promise<NotificationDoc[]>
  adminNotificationsCount(admin_id:string):Promise<NotificationDoc[]>  
}