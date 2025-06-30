import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { IChatService } from "../Interfaces/chat.service.interface";
import { MessageDoc, MessageInput } from "../Model/chatModal";

class ChatServices implements IChatService {
  private chatRepository: IChatRepository;
  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }
  getChats = async (
    projectId: string,
    pageNumber: number,
    limitNumber: number
  ): Promise<MessageDoc[]> => {
    try {
      const chats: MessageDoc[] = await this.chatRepository.getChats(
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
  ): Promise<MessageDoc[]> => {
    try {
      const chats: MessageDoc[] = await this.chatRepository.getChats(
        projectId,
        pageNumber,
        limitNumber
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };

  saveChats = async (messageDetails: MessageInput): Promise<MessageDoc> => {
    try {
      const chats: MessageDoc = await this.chatRepository.saveChats(
        messageDetails
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };
  saveFiles = async (messageWithFile: MessageInput): Promise<MessageDoc> => {
    try {
      const chats: MessageDoc = await this.chatRepository.saveFiles(
        messageWithFile
      );
      return chats;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default ChatServices;
