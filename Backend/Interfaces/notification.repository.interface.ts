import { INotification  } from "./commonInterface";

export interface INotificationRepository{
  saveNotification(notification:INotification):Promise<{message:string,assignedUserId:string}>
  getNotifications(user_id:string):Promise<INotification[]>
  getAdminNotifications(admin_id:string):Promise<INotification[]>
  getNotificationsCount(user_id:string):Promise<INotification[]>
  adminNotificationsCount(admin_id:string):Promise<INotification[]>  
}