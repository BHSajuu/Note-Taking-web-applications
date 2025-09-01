import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User as UserIcon, X, PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { convertMarkdownToHtml } from '../lib/util';
import type { AIAssistantDialogProps, Message } from '../types';



const AIAssistantDialog = ({ onClose, onInsert , count}: AIAssistantDialogProps) => {
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
  }, [conversation]);

  const handleGenerate = async () => {
    if (!prompt || isLoading || requestCount >= 5) return;

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

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">AI Assistant</h2>
          <div className="text-sm text-gray-600">
            Requests remaining today: <span className="font-bold text-blue-600">{Math.max(0, 5 - requestCount)}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>

        {showHistoryChoice ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">Welcome Back!</h3>
            <p className="text-gray-500 mb-6">You have a previous conversation saved.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleContinueChat} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                <MessageSquare size={20} /> Continue Chat
              </button>
              <button onClick={handleNewChat} className="flex items-center justify-center gap-2 bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors text-gray-700">
                <Trash2 size={20} /> Start New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && <div className="p-2 bg-blue-600 rounded-full text-white"><Bot size={20} /></div>}
                  <div className={`prose max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(msg.parts[0].text) }} />
                    { msg.role === 'model' && msg.parts[0].text.length > 0 && !msg.parts[0].text.includes("Sorry") && !msg.parts[0].text.includes("daily limit") && (
                      <button onClick={() => onInsert(msg.parts[0].text)} className="mt-3 text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline">
                        <PlusCircle size={16} /> Insert into Note
                      </button>
                    )}
                  </div>
                  {msg.role === 'user' && <div className="p-2 bg-gray-200 rounded-full text-gray-600"><UserIcon size={20} /></div>}
                </div>
              ))}
               {isLoading && (
                 <div className="flex justify-start">
                   <div className="p-2 bg-blue-600 rounded-full text-white"><Bot size={20} /></div>
                   <div className="p-4 rounded-lg bg-gray-100 ml-3">
                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                   </div>
                 </div>
               )}
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={requestCount >= 5 ? "You've reached your daily limit." : "Ask me anything..."}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isLoading || requestCount >= 5}
                />
                <button onClick={handleGenerate} disabled={isLoading || !prompt || requestCount >= 5} className="bg-blue-600 text-white p-2 rounded-md disabled:bg-gray-400 transition-colors">
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