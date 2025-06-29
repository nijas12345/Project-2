import mongoose, { Schema, InferSchemaType, model, Types } from "mongoose";

const notificationSchema = new Schema({
  admin_id: {
    type: String,
    ref: "Admin",
    required: true,
  },
  assignedUserId: {
    type: String,
    ref: "User",
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task", // Reference to Task model
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    required:false
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required:false
  },
  notificationType: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
  },
});

export type NotificationInput = InferSchemaType<typeof notificationSchema>
export type NotificationDoc = NotificationInput & {_id:Types.ObjectId}

const NotificationModel = model<NotificationDoc>('Notification',notificationSchema)

export default NotificationModel;
