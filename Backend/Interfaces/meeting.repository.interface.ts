import { IMeeting, IProject } from "./commonInterface"

export interface IMeetingRepository{
   scheduleMeetings(meetingData:IMeeting):Promise<IMeeting|null>
   fetchMeetings(userEmail:string,projectId:string):Promise<IMeeting[]>  
   AdminfetchMeetings(admin_id:string,projectId:string):Promise<IMeeting[]>
   updateMeetingStatus(meetingId:string,status:string):Promise<IMeeting|null>
}