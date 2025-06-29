import { MeetingDoc } from "../Model/meetingModal"
import { IMeeting } from "./commonInterface"

export interface IMeetingRepository{
   scheduleMeetings(meetingData:IMeeting):Promise<MeetingDoc|null>
   fetchMeetings(userEmail:string,projectId:string):Promise<MeetingDoc[]>  
   AdminfetchMeetings(admin_id:string,projectId:string):Promise<MeetingDoc[]>
   updateMeetingStatus(meetingId:string,status:string):Promise<MeetingDoc|null>
}