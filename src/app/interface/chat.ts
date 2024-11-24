export interface Chat {
  senderId: string;
  message: string;
  timestamp: number;
  isCurrentUser?: boolean;
  id?: string;
}
