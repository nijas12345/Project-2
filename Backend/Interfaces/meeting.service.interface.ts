
import { IMeeting, IProject} from "./commonInterface"                                   
export interface IMeetingService {
    getMeetings(user_id:string):Promise<IProject[]>
    getAdminMeetings(admin_id:string):Promise<IProject[]>
    scheduleMeetings(admin_id:string,meetingTime:Date,projectId:string,roomId:string):Promise<IMeeting>
    fetchMeetings(user_id:string,projectId:string):Promise<IMeeting[]>
    AdminfetchMeetings(admin_id:string,projectId:string):Promise<IMeeting[]> 
    updateMeetingStatus(meetingId:string,status:string):Promise<IMeeting>    
}