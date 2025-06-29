import { Model } from "mongoose";
import { IMeetingRepository } from "../Interfaces/meeting.repository.interface";
import { MeetingDoc } from "../Model/meetingModal";
import { IMeeting } from "../Interfaces/commonInterface";
import BaseRepository from "./base/baseRepository";

class MeetingRepository extends BaseRepository<MeetingDoc> implements IMeetingRepository{
    private meetingModel = Model<MeetingDoc>
    constructor(meetingModel:Model<MeetingDoc>){
     super(meetingModel)
     this.meetingModel = meetingModel
    }
  scheduleMeetings = async (
    meetingData:IMeeting
  ): Promise<MeetingDoc|null> => {
    try {
      return await this.meetingModel.create(
        meetingData
      );
    } catch(error:unknown) {
      throw error;
    }
  };
  fetchMeetings = async (
    userEmail: string,
    projectId: string
  ): Promise<MeetingDoc[]> => {
    try {
      return await this.meetingModel.find({
        "members.email": userEmail,
        projectId: projectId,
      })
    } catch(error:unknown) {
      throw error;
    }
  };
  AdminfetchMeetings = async (
    admin_id: string,
    projectId: string
  ): Promise<MeetingDoc[]> => {
    try {
      return await this.meetingModel.find({
        admin_id: admin_id,
        projectId: projectId,
      })
    } catch(error:unknown) {
      throw error;
    }
  };
  updateMeetingStatus = async (
    meetingId: string,
    status: string
  ): Promise<MeetingDoc | null> => {
    try {
      return  await this.findOneAndUpdate(
          {meetingId},
          {
            status
          }
        );
    } catch(error:unknown) {
      throw error;
    }
  };
}

export default MeetingRepository;