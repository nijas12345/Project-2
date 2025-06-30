import { InferSchemaType, Schema, Types, model } from "mongoose";

const commentSchema = new Schema({
  user: {
    type: String,
  },
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const taskSchema = new Schema({
  admin_id: {
    type: String,
    ref: "Admin",
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  member: {
    type: String,
    required: true,
  },
  projectId: {
    type: Types.ObjectId,
    ref: "Project",
    required: true,
  },
  taskImage: {
    type: String,
  },
  deadline: {
    type: String,
  },
  acceptanceStatus: {
    type: String,
    enum: ["unAssigned", "active", "reAssigned"],
    default: "unAssigned",
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "inProgress", "completed"],
    default: "pending",
    required: false,
  },
  comments: [commentSchema],
});

export type CommentInput = InferSchemaType<typeof commentSchema>;
export type CommentDoc = CommentInput & { _id: Types.ObjectId };

export type TaskInput = InferSchemaType<typeof taskSchema>;
export type TaskDoc = TaskInput & { _id: Types.ObjectId };

const taskModel = model<TaskDoc>("Task", taskSchema);
export default taskModel;
