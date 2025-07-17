import mongoose, { Types } from "mongoose"

export interface IMember{
    _id?:mongoose.Types.ObjectId;
    email:string
    role:"Admin" | "Member"
}

export interface IMeeting {
   admin_id: string;
  startTime?: Date; 
  endTime?: Date;
  duration?: number; 
  projectId:string|Types.ObjectId;
  MeetingTime: Date; 
  roomId: string; 
  members:IMember[]
  status?: 'active' | 'completed' | 'cancelled';
}


export interface Projects{
    _id?:mongoose.Types.ObjectId;
    user_id:string;
    name:string;
    description:string;
    createdAt:Date
    latestMessage?:LatestMessage | null
    members:Array<IMember>
}

export interface IComments{
    _id:string;
    user:string;
    text:string;
    createdAt:Date;
}

export interface LatestMessage {
    _id: string; // Or `ObjectId` if you're using Mongoose's ObjectId type
    projectId: string; // Project ID as a reference
    senderId: string; // Unique ID of the sender
    senderName: string; // Name of the sender
    text: string; // Message content
    sentAt: Date; // ISO date when the message was sent
    time: string; // Time as a string
    date: string; // Date as a string
    sent: boolean; // Status of the message
    readBy: string[]; // List of users who have read the message
    [key: string]: any; // Additional dynamic properties
  }

export interface Statistics{
    _id:mongoose.Types.ObjectId;
    date:Date,
    clockIn:Date,
    clockOut:Date,
    workDuration:number
}





