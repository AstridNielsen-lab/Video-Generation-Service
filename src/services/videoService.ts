import { VideoGenerationRequest, VideoGenerationResponse } from '../types';
import { VIDEO_API_URL, API_KEY } from '../config';

// Mock video URLs for testing
const MOCK_VIDEOS = [
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=1200&h=800&fit=crop'
];

export async function generateVideo(prompt: string): Promise<VideoGenerationResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For testing, randomly select a mock video
    const randomVideo = MOCK_VIDEOS[Math.floor(Math.random() * MOCK_VIDEOS.length)];
    
    return {
      videoUrl: randomVideo,
      status: 'success'
    };
    
    // Uncomment and update VIDEO_API_URL when your C# backend is ready
    /*
    const request: VideoGenerationRequest = {
      prompt,
      apiKey: API_KEY
    };

    const response = await fetch(VIDEO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}