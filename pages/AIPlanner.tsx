import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithTripWise } from '../apiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hello! 👋 I\'m TripWise AI, your intelligent travel assistant for Pakistan.\n\nI can help you with:\n• Trip planning and itineraries\n• Hotel and accommodation recommendations\n• Route guidance and directions\n• Tourist spot suggestions\n• Best time to visit destinations\n• Budget estimates and cost planning\n• Local cuisine and culture tips\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: '🏔️', label: 'Plan Hunza Trip', query: 'Plan a 5-day trip to Hunza Valley with budget estimate' },
    { icon: '🏨', label: 'Find Hotels', query: 'Recommend good hotels in Skardu' },
    { icon: '🛣️', label: 'Route Help', query: 'Best route from Islamabad to Swat Valley' },
    { icon: '📍', label: 'Tourist Spots', query: 'Top tourist attractions in Murree' },
    { icon: '💰', label: 'Budget Trip', query: 'Plan a budget-friendly trip to northern areas' },
    { icon: '🌤️', label: 'Best Time', query: 'When is the best time to visit Naran Kaghan?' }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call real AI API
      const aiReply = await chatWithTripWise(userInput);
      
      const aiResponse: Message = {
        role: 'ai',
        text: aiReply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'ai',
        text: `Sorry, I encountered an error: ${error.message || 'Please try again later.'}\n\nMake sure the backend server is running on http://localhost:5000`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => {
      const userMessage: Message = {
        role: 'user',
        text: query,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      chatWithTripWise(query)
        .then(aiReply => {
          const aiResponse: Message = {
            role: 'ai',
            text: aiReply,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        })
        .catch(error => {
          const errorMessage: Message = {
            role: 'ai',
            text: `Sorry, I encountered an error: ${error.message || 'Please try again later.'}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        })
        .finally(() => {
          setIsTyping(false);
        });
    }, 100);
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      text: 'Chat cleared! How can I help you plan your next adventure in Pakistan? 🗺️',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              TripWise AI Planner
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Your intelligent travel companion for exploring Pakistan
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.query)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
              >
                <span>{action.icon}</span>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}
        >
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-white font-bold">TripWise AI</h3>
                  <p className="text-emerald-100 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
              >
                <span>🗑️</span>
                <span>Clear</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                        }`}>
                          {message.role === 'user' ? '👤' : '🤖'}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`rounded-2xl px-5 py-3 shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-none px-5 py-3 shadow-md border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask me anything about traveling in Pakistan..."
                  className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Send</span>
                  <span>🚀</span>
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Powered by TripWise AI - Ask specific questions for better recommendations
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
