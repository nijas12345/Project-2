
import { ProjectDoc } from "../Model/projectModal" 
import { MeetingDoc } from "../Model/meetingModal"                                  
export interface IMeetingService {
    getMeetings(user_id:string):Promise<ProjectDoc[]>
    getAdminMeetings(admin_id:string):Promise<ProjectDoc[]>
    scheduleMeetings(admin_id:string,meetingTime:Date,projectId:string,roomId:string):Promise<MeetingDoc>
    fetchMeetings(user_id:string,projectId:string):Promise<MeetingDoc[]>
    AdminfetchMeetings(admin_id:string,projectId:string):Promise<MeetingDoc[]> 
    updateMeetingStatus(meetingId:string,status:string):Promise<MeetingDoc>    
}