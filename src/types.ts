export interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface VideoState {
  url: string | null;
  status: 'idle' | 'generating' | 'ready' | 'error';
}