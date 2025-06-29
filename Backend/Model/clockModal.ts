import mongoose, { Schema, InferSchemaType, Types } from "mongoose";

const workLogSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  clockIn: {
    type: Date,
    required: true,
  },
  clockOut: {
    type: Date,
    required: true,
  },
  breakDuration: {
    type: Number,
    required: true,
  },
  breakStart: {
    type: Date,
    required: true,
  },
  breakEnd: {
    type: Date,
    required: true,
  },
  workDuration: {
    type: Number,
    required: true,
  },
  isClockedIn: {
    type: Boolean,
    default: false,
  },
  isOnBreak: {
    type: Boolean,
    default: false,
  },
});

export type WorkLogInput = InferSchemaType<typeof workLogSchema>;
export type WorkLogDoc = WorkLogInput & { _id: Types.ObjectId };

export const workLogModel = mongoose.model<WorkLogDoc>("WorkLog", workLogSchema);
export default workLogModel;
