import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User as UserIcon, X, PlusCircle, MessageSquare, Trash2, Zap } from 'lucide-react';
import { convertMarkdownToHtml } from '../lib/util';
import type { AIAssistantDialogProps, Message } from '../types';

const AIAssistantDialog = ({ onClose, onInsert, count }: AIAssistantDialogProps) => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(count);
  const [showHistoryChoice, setShowHistoryChoice] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedConversation = localStorage.getItem(`conversation-${user?._id}`);
    if (savedConversation && JSON.parse(savedConversation).length > 0) {
      setShowHistoryChoice(true);
    }
  }, [user]);

  useEffect(() => {
    if (conversation.length > 0) {
      localStorage.setItem(`conversation-${user?._id}`, JSON.stringify(conversation));
    }
  }, [conversation, user?._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation, isLoading]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading || requestCount >= 5) return;

    const newUserMessage: Message = { role: 'user', parts: [{ text: prompt }] };
    setConversation((prev) => [...prev, newUserMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai/generate', {
        prompt,
        history: conversation,
      });
      const newModelMessage: Message = { role: 'model', parts: [{ text: data.text }] };
      setConversation((prev) => [...prev, newModelMessage]);
      setRequestCount(data.requestCount);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sorry, an error occurred.';
      const newModelMessage: Message = { role: 'model', parts: [{ text: errorMessage }] };
      setConversation((prev) => [...prev, newModelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setConversation([]);
    localStorage.removeItem(`conversation-${user?._id}`);
    setShowHistoryChoice(false);
  };

  const handleContinueChat = () => {
    const savedConversation = localStorage.getItem(`conversation-${user?._id}`);
    if (savedConversation) {
      setConversation(JSON.parse(savedConversation));
    }
    setShowHistoryChoice(false);
  };

  const BotTypingLoader = () => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white shadow-md">
        <Bot size={20} />
      </div>
      <div className="prose max-w-lg p-3 rounded-lg bg-gray-100 flex items-center space-x-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0   backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Zap className="text-purple-600" size={24} />
            AI Assistant
          </h2>
          <div className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
            Requests remaining: <span className="font-bold text-blue-600">{Math.max(0, 5 - requestCount)}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors rounded-full p-1 hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        {showHistoryChoice ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
                <MessageSquare size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Welcome Back!</h3>
            <p className="text-gray-500 mb-6 max-w-sm">You have a previous conversation history. Would you like to continue or start fresh?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleContinueChat} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <MessageSquare size={20} /> Continue Chat
              </button>
              <button onClick={handleNewChat} className="flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors text-gray-700 font-medium">
                <Trash2 size={20} /> Start New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  {msg.role === 'model' && (
                    <div className="flex-shrink-0 p-0.5 bg-gradient-to-br from-blue-500 to-green-600 rounded-full text-white shadow-md">
                        <img src="/bot.png" alt="bot" className='w-10 ' />
                    </div>
                  )}
                  <div className={`prose max-w-lg p-3 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100'}`}>
                    <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(msg.parts[0].text) }} />
                    { msg.role === 'model' && msg.parts[0].text.length > 0 && !msg.parts[0].text.includes("Sorry") && !msg.parts[0].text.includes("daily limit") && (
                      <button onClick={() => onInsert(msg.parts[0].text)} className="mt-4 text-blue-600 font-semibold text-sm flex items-center gap-1.5 border p-2 rounded-2xl hover:bg-gray-300 opacity-80 hover:opacity-100 transition-all duration-300">
                        <PlusCircle size={16} /> Insert into Note
                      </button>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 p-2 bg-gray-200 rounded-full text-gray-600">
                        <UserIcon size={20} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && <BotTypingLoader />}
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={requestCount >= 5 ? "You've reached your daily limit." : "Ask me anything..."}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={isLoading || requestCount >= 5}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim() || requestCount >= 5}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistantDialog;