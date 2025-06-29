"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class MeetingServices {
    constructor(meetingRepository, adminRepository, userRepository, projectRepository) {
        this.getMeetings = async (user_id) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No user data found");
                }
                const email = userData.email;
                const projectData = await this.projectRepository.getMeetings(email);
                return projectData;
            }
            catch (error) {
                throw error;
            }
        };
        this.getAdminMeetings = async (admin_id) => {
            try {
                const projectData = await this.projectRepository.getAdminMeetings(admin_id);
                return projectData;
            }
            catch (error) {
                throw error;
            }
        };
        this.scheduleMeetings = async (admin_id, meetingTime, projectId, roomId) => {
            try {
                const projectData = await this.projectRepository.findProjectById(projectId);
                if (!projectData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No project data found");
                }
                const members = projectData.members.map((member) => ({
                    email: member.email,
                    role: "Member",
                }));
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData)
                    throw new Error("No Admin Data");
                const meetingData = {
                    admin_id: admin_id,
                    projectId: projectId,
                    MeetingTime: meetingTime,
                    roomId: roomId,
                    members: members,
                };
                const meeting = await this.meetingRepository.scheduleMeetings(meetingData);
                if (!meeting)
                    throw new Error("No meeting created");
                return meeting;
            }
            catch (error) {
                throw error;
            }
        };
        this.fetchMeetings = async (user_id, projectId) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No user data found");
                }
                const userEmail = userData.email;
                const meetingData = await this.meetingRepository.fetchMeetings(userEmail, projectId);
                return meetingData;
            }
            catch (error) {
                throw error;
            }
        };
        this.AdminfetchMeetings = async (admin_id, projectId) => {
            try {
                const meetingData = await this.meetingRepository.AdminfetchMeetings(admin_id, projectId);
                return meetingData;
            }
            catch (error) {
                throw error;
            }
        };
        this.updateMeetingStatus = async (meetingId, status) => {
            try {
                const meetingData = await this.meetingRepository.updateMeetingStatus(meetingId, status);
                if (!meetingData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No meeting data found");
                }
                return meetingData;
            }
            catch (error) {
                throw error;
            }
        };
        this.meetingRepository = meetingRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }
}
exports.default = MeetingServices;
