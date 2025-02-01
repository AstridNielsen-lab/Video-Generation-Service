import React, { useState, useRef, useEffect } from 'react';
import { Send, Video, Download, Trash2, Loader2 } from 'lucide-react';
import { Message, VideoState } from './types';
import { API_URL, API_KEY } from './config';
import { generateVideo } from './services/videoService';
import { Canvas } from './components/Canvas';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [videoState, setVideoState] = useState<VideoState>({ url: null, status: 'idle' });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { content: input, role: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setVideoState({ url: null, status: 'generating' });

    try {
      const aiResponse = await fetch(`${API_URL}/generate-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({ prompt: input })
      });

      if (!aiResponse.ok) throw new Error(`AI API error: ${aiResponse.status}`);
      const aiData = await aiResponse.json();

      const assistantMessage: Message = {
        content: aiData.text,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      const videoResponse = await generateVideo(input);
      setVideoState({ url: videoResponse.videoUrl, status: 'ready' });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { content: 'Error processing request.', role: 'assistant', timestamp: new Date() }]);
      setVideoState({ url: null, status: 'error' });
    }
  };

  const handleDownload = async () => {
    if (!videoState.url) return;
    try {
      const response = await fetch(videoState.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="w-6 h-6" /> Video Generation Studio
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Chat with AI</h2></div>
          <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}> 
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>{msg.content}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={videoState.status === 'generating'} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Video Preview</h2></div>
          <div className="p-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {videoState.status === 'generating' ? (
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              ) : videoState.url ? (
                <Canvas videoUrl={videoState.url} />
              ) : (
                <p className="text-gray-400">No video generated yet</p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleSubmit} disabled={videoState.status === 'generating'} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                <Video className="w-5 h-5" /> Generate Video
              </button>
              <button onClick={handleDownload} disabled={!videoState.url} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
