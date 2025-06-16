import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { IChatService } from "../Interfaces/chat.service.interface";
import { IMessage } from "../Interfaces/commonInterface";

class ChatServices implements IChatService {
  private chatRepository: IChatRepository;
  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }
  getChats = async (
    projectId: string,
    pageNumber: number,
    limitNumber: number
  ): Promise<IMessage[]> => {
    try {
      const chats: IMessage[] = await this.chatRepository.getChats(
        projectId,
        pageNumber,
        limitNumber
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminChats = async (
    projectId: string,
    pageNumber: number,
    limitNumber: number
  ): Promise<IMessage[]> => {
    try {
      const chats: IMessage[] = await this.chatRepository.getChats(
        projectId,
        pageNumber,
        limitNumber
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };

  saveChats = async (messageDetails: IMessage): Promise<IMessage> => {
    try {
      const chats: IMessage = await this.chatRepository.saveChats(
        messageDetails
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };
  saveFiles = async (messageWithFile: IMessage): Promise<IMessage> => {
    try {
      const chats: IMessage = await this.chatRepository.saveFiles(
        messageWithFile
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default ChatServices;
