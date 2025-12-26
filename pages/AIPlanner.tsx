import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { askAIChat, getAIRecommendations } from '../mockService';
import { Spot } from '../types';

export const AIPlanner = () => {
  const [tab, setTab] = useState<'chat' | 'plan'>('plan');
  
  // Chat State
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your AI guide for Pakistan. Ask me about weather, food, or specific spots.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Planner State
  const [interests, setInterests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Spot[] | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    const response = await askAIChat(userMsg);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
  };

  const handlePlan = async () => {
    setIsGenerating(true);
    const recs = await getAIRecommendations({
      duration: 5,
      budget: 'standard',
      interests: interests.split(',').map(s => s.trim()),
    });
    setRecommendations(recs);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-lg border shadow-sm inline-flex">
          <button 
            onClick={() => setTab('plan')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'plan' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Itinerary Planner
          </button>
          <button 
            onClick={() => setTab('chat')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'chat' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:text-gray-900'}`}
          >
            AI Chat Assistant
          </button>
        </div>
      </div>

      {tab === 'chat' ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-gray-400 animate-pulse">AI is typing...</div>}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input 
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ask about northern areas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Send</button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <h2 className="text-2xl font-bold mb-4">Let AI build your perfect trip</h2>
            <p className="text-gray-500 mb-6">Enter your interests (e.g., Hiking, History, Food, Lakes) and we'll suggest the best spots.</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input 
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Hiking, Lakes, History..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
              <button 
                onClick={handlePlan}
                disabled={isGenerating}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {isGenerating ? 'Thinking...' : 'Generate'}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400">Mock AI: Runs locally in browser</div>
          </div>

          {recommendations && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Top Recommendations for You</h3>
              {recommendations.map((spot, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow border flex gap-4 items-center">
                  <img src={spot.imageUrl} className="w-24 h-24 rounded object-cover" alt={spot.name} />
                  <div>
                    <h4 className="font-bold text-lg">{spot.name}</h4>
                    <p className="text-sm text-gray-600">{spot.description}</p>
                    <div className="mt-2 text-xs bg-emerald-100 text-emerald-800 inline-block px-2 py-1 rounded">
                      Match Score: {Math.round((spot as any).score * 10)}%
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
