import { Model } from "mongoose";
import { IMeeting } from "../Interfaces/commonInterface";
import { IMeetingRepository } from "../Interfaces/meeting.repository.interface";

class MeetingRepository implements IMeetingRepository{
    private meetingModel = Model<IMeeting>
    constructor(meetingModel:Model<IMeeting>){
     this.meetingModel = meetingModel
    }
  scheduleMeetings = async (
    meetingData:IMeeting
  ): Promise<IMeeting|null> => {
    try {
      const meeting: IMeeting | null = await this.meetingModel.create(
        meetingData
      );
      return meeting
    } catch(error:unknown) {
      throw error;
    }
  };
  fetchMeetings = async (
    userEmail: string,
    projectId: string
  ): Promise<IMeeting[]> => {
    try {
      const meetingData = (await this.meetingModel.find({
        "members.email": userEmail,
        projectId: projectId,
      })) as IMeeting[];
      return meetingData
    } catch(error:unknown) {
      throw error;
    }
  };
  AdminfetchMeetings = async (
    admin_id: string,
    projectId: string
  ): Promise<IMeeting[]> => {
    try {
      const meeting = await this.meetingModel.find();
      console.log("mettng", meeting);

      const meetingData = (await this.meetingModel.find({
        admin_id: admin_id,
        projectId: projectId,
      })) as IMeeting[];
      return meetingData;
    } catch(error:unknown) {
      throw error;
    }
  };
  updateMeetingStatus = async (
    meetingId: string,
    status: string
  ): Promise<IMeeting | null> => {
    try {
      const meetingData: IMeeting | null =
        await this.meetingModel.findByIdAndUpdate(
          meetingId,
          {
            status: status,
          },
          { new: true }
        );
      return meetingData;
    } catch(error:unknown) {
      throw error;
    }
  };
}

export default MeetingRepository;