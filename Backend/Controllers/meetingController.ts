import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { IMeetingService } from "../Interfaces/meeting.service.interface";
import { handleError } from "../Utils/handleError";

class MeetingController {
  private meetingService: IMeetingService;
  constructor(meetingService: IMeetingService) {
    this.meetingService = meetingService;
  }
  getMeetings = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const serviceResponse = await this.meetingService.getMeetings(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  getAdminMeetings = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const serviceResponse = await this.meetingService.getAdminMeetings(
        admin_id
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  scheduleMeeting = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const { meetingTime, projectId, roomId } = req.body;
      const serviceResponse = await this.meetingService.scheduleMeetings(
        admin_id,
        meetingTime,
        projectId,
        roomId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  fetchMeetings = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const { projectId } = req.body;
      const serviceResponse = await this.meetingService.fetchMeetings(
        user_id,
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  AdminfetchMeetings = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const { projectId } = req.body;
      const serviceResponse = await this.meetingService.AdminfetchMeetings(
        admin_id,
        projectId
      );

      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  updateMeetingStatus = async (req: Request, res: Response) => {
    try {
      const { meetingId, status } = req.body;
      const serviceResponse = await this.meetingService.updateMeetingStatus(
        meetingId,
        status
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}

export default MeetingController;
