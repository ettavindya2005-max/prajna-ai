import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! Ask me anything about your recent meetings or tasks.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/chat', { question: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please ensure the backend server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-xl w-80 h-96 flex flex-col overflow-hidden border border-gray-100 transition-all duration-300">
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2"><MessageCircle className="w-5 h-5"/> AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-700 p-1 rounded-full"><X className="w-5 h-5"/></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary-100 text-primary-900 self-end rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs self-start ml-2">AI is typing...</div>}
          </div>
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about tasks..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            />
            <button onClick={handleSend} disabled={loading} className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
