"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const handleError_1 = require("../Utils/handleError");
class MeetingController {
    constructor(meetingService) {
        this.getMeetings = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.meetingService.getMeetings(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.getAdminMeetings = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.meetingService.getAdminMeetings(admin_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.scheduleMeeting = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const { meetingTime, projectId, roomId } = req.body;
                const serviceResponse = await this.meetingService.scheduleMeetings(admin_id, meetingTime, projectId, roomId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.fetchMeetings = async (req, res) => {
            try {
                const user_id = req.user_id;
                const { projectId } = req.body;
                const serviceResponse = await this.meetingService.fetchMeetings(user_id, projectId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.AdminfetchMeetings = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const { projectId } = req.body;
                const serviceResponse = await this.meetingService.AdminfetchMeetings(admin_id, projectId);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.updateMeetingStatus = async (req, res) => {
            try {
                const { meetingId, status } = req.body;
                const serviceResponse = await this.meetingService.updateMeetingStatus(meetingId, status);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.meetingService = meetingService;
    }
}
exports.default = MeetingController;
