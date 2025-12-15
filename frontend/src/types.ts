export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  VISION = 'VISION',
  IMAGE_GEN = 'IMAGE_GEN',
  SEARCH = 'SEARCH'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 string for display
  sources?: Array<{ title: string; uri: string }>;
  timestamp: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
