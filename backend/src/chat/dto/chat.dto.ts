export interface CreateSupportRequestDto {
    title: string;
    text: string;
  }

export interface SendMessageDto {
      author: string;
      role: string;
      name: string;
      text: string;
  }

export interface MarkMessagesAsReadDto {
    user: string;
    supportRequest: string;
    createdBefore: Date;
  }

export interface GetChatListParams {
    user?: string | null;
    isActive: boolean;
  }