import { NotificationDoc, NotificationInput } from "../Model/notificationModal"

export interface INotificationService{
    saveNotification(notificationDetails:NotificationInput):Promise<{message:string,assignedUserId:string}>
    userSaveNotification(notificationDetails:NotificationInput):Promise<{message:string,admin_id:string}>
    getNotifications(user_id:string):Promise<NotificationDoc[]>
    getAdminNotifications(admin_id:string):Promise<NotificationDoc[]>
    getNotificationsCount(user_id:string):Promise<NotificationDoc[]>
    adminNotificationsCount(admin_id:string):Promise<NotificationDoc[]>   
}