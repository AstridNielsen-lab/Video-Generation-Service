export interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface VideoState {
  url: string | null;
  status: 'idle' | 'generating' | 'ready' | 'error';
}

export interface VideoGenerationRequest {
  prompt: string;
  apiKey: string;
}

export interface VideoGenerationResponse {
  videoUrl: string;
  status: string;
  error?: string;
}