import { MeetingDoc, MeetingInput } from "../Model/meetingModal"

export interface IMeetingRepository{
   scheduleMeetings(meetingData:MeetingInput):Promise<MeetingDoc|null>
   fetchMeetings(userEmail:string,projectId:string):Promise<MeetingDoc[]>  
   AdminfetchMeetings(admin_id:string,projectId:string):Promise<MeetingDoc[]>
   updateMeetingStatus(meetingId:string,status:string):Promise<MeetingDoc|null>
}