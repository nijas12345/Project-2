import { Model } from "mongoose";
import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { IMessage, LatestMessage, Projects } from "../Interfaces/commonInterface";

class ChatRepository implements IChatRepository {
  private chatModel = Model<IMessage>;
  constructor(chatModel: Model<IMessage>) {
    this.chatModel = chatModel;
  }
  getChats = async (
    projectId: string,
    pageNumber: number,
    limitNumber: number
  ): Promise<IMessage[]> => {
    try {
      const chatData: IMessage[] = await this.chatModel
        .find({ projectId: projectId })
        .sort({ _id: -1 }) // Get newest chats first
        .skip((pageNumber - 1) * limitNumber) // Pagination logic
        .limit(limitNumber); // Use limitNumber parameter

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
  ): Promise<IMessage[] > => {
    try {
      const chatData: IMessage[] = await this.chatModel
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
  saveChats = async (messageDetails: IMessage): Promise<IMessage> => {
    try {
      const savedMessage = await this.chatModel.create(messageDetails);
      return savedMessage;
    } catch (error: unknown) {
      throw error;
    }
  };
  saveFiles = async (messageWithFile: IMessage): Promise<IMessage> => {
    try {
      delete messageWithFile._id;
      const savedMessage = await this.chatModel.create(messageWithFile);
      return savedMessage;
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
