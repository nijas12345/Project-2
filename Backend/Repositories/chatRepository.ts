import { Model } from "mongoose";
import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { LatestMessage, Projects } from "../Interfaces/commonInterface";
import { MessageDoc } from "../Model/chatModal";
import BaseRepository from "./base/baseRepository";

class ChatRepository extends BaseRepository<MessageDoc> implements IChatRepository {
  private chatModel = Model<MessageDoc>;
  constructor(chatModel: Model<MessageDoc>) {
    super(chatModel)
    this.chatModel = chatModel;
  }
  getChats = async (
    projectId: string,
    pageNumber: number,
    limitNumber: number
  ): Promise<MessageDoc[]> => {
    try {
      const chatData: MessageDoc[] = await this.chatModel
        .find({ projectId: projectId })
        .sort({ _id: -1 }) 
        .skip((pageNumber - 1) * limitNumber) 
        .limit(limitNumber); 

      const sortedChatData = chatData.reverse() // Reverse to chronological order
      return sortedChatData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminChats = async (
    projectId: string,
    pageNumber: number,
    limitNumber: number
  ): Promise<MessageDoc[] > => {
    try {
      const chatData: MessageDoc[] = await this.chatModel
        .find({ projectId: projectId })
        .sort({ _id: -1 }) // Get newest chats first
        .skip((pageNumber - 1) * limitNumber) // Pagination logic
        .limit(limitNumber); // Use limitNumber parameter

      const sortedChatData = chatData // Reverse to chronological order
      return sortedChatData;
    } catch (error: unknown) {
      throw error;
    }
  };
  saveChats = async (messageDetails: MessageDoc): Promise<MessageDoc> => {
    try {
      return this.createData(messageDetails);
    } catch (error: unknown) {
      throw error;
    }
  };
  saveFiles = async (messageWithFile: MessageDoc): Promise<MessageDoc> => {
    try {
      // delete messageWithFile._id;
      return await this.createData(messageWithFile);
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteChatByProjectId = async (projectId: string): Promise<void> => {
    try {
      await this.chatModel.deleteMany({ projectId: projectId });
    } catch (error:unknown) {
      throw error
    }
  }
  findLatestProjectsByMessage = async (combinedProjects:Projects[]):Promise<Projects[]> =>{
    try {
      const sortedProjects: Projects[] = await Promise.all(
              combinedProjects.map(async (project) => {
                const latestMessage = await this.chatModel
                  .findOne({ projectId: project._id })
                  .sort({ sentAt: -1 })
                  .lean<LatestMessage>();
                return {
                  ...project, // Spread the current project details
                  latestMessage, // Attach the latest message
                };
              })
            );
            sortedProjects.sort((a, b) => {
              const dateA = a.latestMessage?.sentAt
                ? new Date(a.latestMessage.sentAt).getTime()
                : 0;
              const dateB = b.latestMessage?.sentAt
                ? new Date(b.latestMessage.sentAt).getTime()
                : 0;
              return dateB - dateA; // Descending order
            });
            return sortedProjects;
    } catch (error) {
      throw error
    }
  }
}

export default ChatRepository;
