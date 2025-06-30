import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

// Define the Message Schema
const memberSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Member"],
  },
});

const meetingSchema = new Schema({
  admin_id: {
    type: String,
    ref: "Admin",
    required: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  MeetingTime: {
    type: Date,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
    required: true, // Optional: ensures that the status field is required
  },
  members: [memberSchema],
});

export type MemberInput = InferSchemaType<typeof memberSchema>;
export type MemberDoc = MemberInput & { _id: Types.ObjectId };

export type MeetingInput = InferSchemaType<typeof meetingSchema>;
export type MeetingDoc = MeetingInput & { _id: Types.ObjectId };

const MeetingModel = mongoose.model<MeetingDoc>("Meeting", meetingSchema);
export default MeetingModel;
