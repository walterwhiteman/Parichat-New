export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  imageUrl?: string;
}

export interface User {
  username: string;
  isOnline: boolean;
  lastSeen?: number;
}

export interface ChatRoom {
  id: string;
  users: User[];
  messages: Message[];
  createdAt: number;
}
