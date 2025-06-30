import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import {
  IMeeting,
  IMember,
} from "../Interfaces/commonInterface";
import { IMeetingRepository } from "../Interfaces/meeting.repository.interface";
import { IMeetingService } from "../Interfaces/meeting.service.interface";
import { IProjectRepository } from "../Interfaces/project.repository.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { UserDoc } from "../Model/userModal";
import { ProjectDoc } from "../Model/projectModal";
import { AdminDoc } from "../Model/adminModal";
import { MeetingDoc } from "../Model/meetingModal";

class MeetingServices implements IMeetingService {
  private meetingRepository: IMeetingRepository;
  private adminRepository: IAdminRepository;
  private userRepository: IUserRepository;
  private projectRepository: IProjectRepository;
  constructor(
    meetingRepository: IMeetingRepository,
    adminRepository: IAdminRepository,
    userRepository: IUserRepository,
    projectRepository: IProjectRepository
  ) {
    this.meetingRepository = meetingRepository;
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.projectRepository = projectRepository;
  }
  getMeetings = async (user_id: string): Promise<ProjectDoc[]> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No user data found");
      }
      const email: string = userData.email;
      const projectData: ProjectDoc[] = await this.projectRepository.getMeetings(
        email
      );
      return projectData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminMeetings = async (admin_id: string): Promise<ProjectDoc[]> => {
    try {
      const projectData: ProjectDoc[] =
        await this.projectRepository.getAdminMeetings(admin_id);
      return projectData;
    } catch (error: unknown) {
      throw error;
    }
  };
  scheduleMeetings = async (
    admin_id: string,
    meetingTime: Date,
    projectId: string,
    roomId: string
  ): Promise<MeetingDoc> => {
    try {
      const projectData: ProjectDoc | null =
        await this.projectRepository.findProjectById(projectId);
      if (!projectData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No project data found");
      }
      const members: IMember[] = projectData.members.map((member) => ({
        email: member.email,
        role: "Member",
      }));
      const adminData: AdminDoc | null = await this.adminRepository.findByAdminId(
        admin_id
      );
      if (!adminData) throw new Error("No Admin Data");
      const meetingData:IMeeting = {
        admin_id: admin_id,
        projectId: projectId,
        MeetingTime: meetingTime,
        roomId: roomId,
        members: members,
      };
      const meeting: MeetingDoc | null =
        await this.meetingRepository.scheduleMeetings(meetingData);
      if (!meeting) throw new Error("No meeting created");
      return meeting;
    } catch (error: unknown) {
      throw error;
    }
  };
  fetchMeetings = async (
    user_id: string,
    projectId: string
  ): Promise<MeetingDoc[]> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );

      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No user data found");
      }
      const userEmail: string = userData.email;
      const meetingData: MeetingDoc[] =
        await this.meetingRepository.fetchMeetings(userEmail, projectId);
      return meetingData;
    } catch (error: unknown) {
      throw error;
    }
  };
  AdminfetchMeetings = async (
    admin_id: string,
    projectId: string
  ): Promise<MeetingDoc[]> => {
    try {
      const meetingData: MeetingDoc[] =
        await this.meetingRepository.AdminfetchMeetings(admin_id, projectId);
      return meetingData;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateMeetingStatus = async (
    meetingId: string,
    status: string
  ): Promise<MeetingDoc> => {
    try {
      const meetingData: MeetingDoc | null =
        await this.meetingRepository.updateMeetingStatus(meetingId, status);
      if (!meetingData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No meeting data found");
      }
      return meetingData;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default MeetingServices;
