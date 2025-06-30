import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { IChatService } from "../Interfaces/chat.service.interface";
import { handleError } from "../Utils/handleError";

class ChatController {
  private chatService: IChatService;
  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }
  getChats = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.projectId;
      const pageNumber: number = parseInt(
        (req.query.page as string) || "1",
        10
      );
      const limitNumber: number = parseInt(
        (req.query.limit as string) || "5",
        10
      );
      console.log(limitNumber,pageNumber);
      
      const serviceResponse = await this.chatService.getChats(
        projectId,
        pageNumber,
        limitNumber
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  getAdminChats = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.projectId;
      const pageNumber: number = parseInt(
        (req.query.page as string) || "1",
        10
      );
      const limitNumber: number = parseInt(
        (req.query.limit as string) || "5",
        10
      );
      const serviceResponse = await this.chatService.getChats(
        projectId,
        pageNumber,
        limitNumber
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
}

export default ChatController;
