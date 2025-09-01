import { useState } from 'react';
import api from '../services/api';

interface AIAssistantDialogProps {
  onClose: () => void;
  onInsert: (text: string) => void;
}

const AIAssistantDialog = ({ onClose, onInsert }: AIAssistantDialogProps) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const { data } = await api.post('/ai/generate', { prompt });
      setResponse(data.text);
    } catch (error) {
      console.error('Failed to generate content:', error);
      setResponse('Sorry, I was unable to generate a response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
            Close
          </button>
        </div>
        {response && (
          <div>
            <div className="border p-4 rounded-md bg-gray-50 max-h-60 overflow-y-auto">
              {response}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => onInsert(response)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Insert
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantDialog;