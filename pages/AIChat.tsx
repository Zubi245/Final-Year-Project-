import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hello! 👋 I\'m your AI Travel Assistant for Pakistan. I can help you with:\n\n• Trip planning and itineraries\n• Hotel recommendations\n• Route guidance\n• Tourist spot suggestions\n• Best time to visit\n• Budget estimates\n\nHow can I assist you today?',
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
    { icon: '💰', label: 'Plan a Budget Trip', query: 'Plan a budget-friendly 5-day trip to northern areas' },
    { icon: '🏨', label: 'Find Hotels', query: 'Recommend good hotels in Hunza Valley' },
    { icon: '🛣️', label: 'Route Guidance', query: 'Best route from Islamabad to Skardu' },
    { icon: '📍', label: 'Tourist Spots', query: 'Top tourist attractions in Swat Valley' },
    { icon: '🌤️', label: 'Best Time to Visit', query: 'When is the best time to visit Murree?' }
  ];

  const generateAIResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();

    // Budget trip responses
    if (query.includes('budget') || query.includes('cheap') || query.includes('affordable')) {
      return `🎒 **Budget Trip Recommendations**\n\nFor an affordable trip, I suggest:\n\n**Destinations:**\n• Naran Kaghan Valley - Beautiful and budget-friendly\n• Murree & Nathia Gali - Close to major cities\n• Swat Valley - Affordable accommodations\n\n**Budget Breakdown (5 days, 2 people):**\n• Transport: Rs. 15,000 - 20,000\n• Accommodation: Rs. 12,000 - 18,000\n• Food: Rs. 8,000 - 12,000\n• Activities: Rs. 5,000 - 8,000\n**Total: Rs. 40,000 - 58,000**\n\n**Money-Saving Tips:**\n✓ Travel by bus instead of private car\n✓ Book guest houses instead of hotels\n✓ Eat at local restaurants\n✓ Visit during off-season (March-April)\n\nWould you like detailed itinerary for any specific destination?`;
    }

    // Hotel recommendations
    if (query.includes('hotel') || query.includes('stay') || query.includes('accommodation')) {
      const destination = query.includes('hunza') ? 'Hunza' :
                         query.includes('murree') ? 'Murree' :
                         query.includes('skardu') ? 'Skardu' :
                         query.includes('swat') ? 'Swat' : 'Northern Areas';

      return `🏨 **Hotel Recommendations in ${destination}**\n\n**Budget Options (Rs. 2,000-4,000/night):**\n• Mountain View Guest House - Clean, basic amenities\n• Valley Inn - Family-friendly, good location\n• Traveler's Rest - Budget backpacker favorite\n\n**Mid-Range (Rs. 5,000-10,000/night):**\n• Serena Hotel - Excellent service, scenic views\n• Pearl Continental - Premium facilities\n• Mountain Lodge Resort - Modern amenities\n\n**Luxury (Rs. 15,000+/night):**\n• Hunza Serena Inn - 5-star luxury\n• Shangrila Resort - Iconic location\n• Luxus Hotel - Premium experience\n\n**Booking Tips:**\n✓ Book 2-3 weeks in advance\n✓ Check reviews on TripAdvisor\n✓ Confirm amenities (heating, hot water)\n✓ Ask about meal packages\n\nNeed help with specific hotel booking?`;
    }

    // Route guidance
    if (query.includes('route') || query.includes('road') || query.includes('how to reach') || query.includes('travel from')) {
      const from = query.includes('islamabad') ? 'Islamabad' :
                   query.includes('lahore') ? 'Lahore' :
                   query.includes('karachi') ? 'Karachi' : 'your city';
      const to = query.includes('hunza') ? 'Hunza' :
                 query.includes('skardu') ? 'Skardu' :
                 query.includes('swat') ? 'Swat' :
                 query.includes('murree') ? 'Murree' : 'northern areas';

      return `🛣️ **Route Guidance: ${from} to ${to}**\n\n**By Car:**\n• Distance: ~650 km\n• Duration: 12-14 hours\n• Route: ${from} → Mansehra → Chilas → ${to}\n• Road Condition: Good (KKH)\n• Fuel Cost: Rs. 8,000-10,000\n\n**By Bus:**\n• NATCO/Silk Route buses available\n• Fare: Rs. 2,500-3,500 per person\n• Duration: 14-16 hours\n• Departure: Early morning (5-6 AM)\n\n**By Flight:**\n• PIA operates flights (seasonal)\n• Duration: 1 hour\n• Cost: Rs. 15,000-25,000\n• Limited availability\n\n**Important Tips:**\n⚠️ Check weather before traveling\n⚠️ Carry warm clothes (even in summer)\n⚠️ Keep medicines for altitude sickness\n⚠️ Fuel up at major cities\n⚠️ Download offline maps\n\nWould you like accommodation suggestions along the route?`;
    }

    // Tourist spots
    if (query.includes('tourist') || query.includes('places') || query.includes('visit') || query.includes('attractions')) {
      const destination = query.includes('hunza') ? 'Hunza Valley' :
                         query.includes('swat') ? 'Swat Valley' :
                         query.includes('skardu') ? 'Skardu' :
                         query.includes('murree') ? 'Murree' : 'Pakistan';

      return `📍 **Top Tourist Attractions in ${destination}**\n\n**Must-Visit Places:**\n\n1. **Attabad Lake** 🏞️\n   • Stunning turquoise water\n   • Boating available\n   • 2 hours from Karimabad\n\n2. **Baltit Fort** 🏰\n   • 700-year-old fort\n   • Panoramic valley views\n   • Museum inside\n\n3. **Passu Cones** ⛰️\n   • Iconic mountain peaks\n   • Photography paradise\n   • Suspension bridge nearby\n\n4. **Rakaposhi Viewpoint** 🏔️\n   • 7,788m peak view\n   • Best sunrise spot\n   • Free entry\n\n5. **Duikar Valley** 🌄\n   • Hidden gem\n   • Less crowded\n   • Perfect for hiking\n\n**Activities:**\n✓ Trekking & Hiking\n✓ Photography\n✓ Local cuisine tasting\n✓ Cultural experiences\n✓ Jeep safaris\n\n**Best Time:** April-October\n**Duration Needed:** 4-7 days\n\nWant a detailed day-by-day itinerary?`;
    }

    // Best time to visit
    if (query.includes('when') || query.includes('best time') || query.includes('season') || query.includes('weather')) {
      return `🌤️ **Best Time to Visit Pakistan's Northern Areas**\n\n**Spring (March-May)** 🌸\n• Temperature: 15-25°C\n• Pros: Blooming flowers, pleasant weather\n• Cons: Some roads may be closed\n• Best for: Hunza, Swat, Murree\n\n**Summer (June-August)** ☀️\n• Temperature: 20-30°C\n• Pros: All roads open, peak season\n• Cons: Crowded, higher prices\n• Best for: Skardu, Fairy Meadows, Naran\n\n**Autumn (September-November)** 🍂\n• Temperature: 10-20°C\n• Pros: Golden landscapes, fewer tourists\n• Cons: Getting cold, some areas close\n• Best for: Hunza (golden leaves), Swat\n\n**Winter (December-February)** ❄️\n• Temperature: -5 to 10°C\n• Pros: Snow activities, lowest prices\n• Cons: Many roads closed, very cold\n• Best for: Murree, Nathia Gali (snow)\n\n**My Recommendation:**\n🌟 **April-May or September-October**\n• Perfect weather\n• Moderate crowds\n• Reasonable prices\n• All attractions accessible\n\nWhich season interests you most?`;
    }

    // Hunza specific
    if (query.includes('hunza')) {
      return `🏔️ **Complete Hunza Valley Guide**\n\n**Overview:**\nHunza is one of Pakistan's most beautiful destinations, known for stunning mountain views, friendly locals, and rich culture.\n\n**Top Attractions:**\n• Attabad Lake - Turquoise beauty\n• Baltit Fort - Historical landmark\n• Altit Fort - Ancient architecture\n• Passu Cones - Iconic peaks\n• Rakaposhi Viewpoint - Breathtaking\n\n**Recommended Duration:** 5-7 days\n\n**Budget Estimate (2 people):**\n• Transport: Rs. 20,000-30,000\n• Hotels: Rs. 15,000-25,000\n• Food: Rs. 10,000-15,000\n• Activities: Rs. 5,000-10,000\n**Total: Rs. 50,000-80,000**\n\n**Best Time:** April-October\n\n**Must Try:**\n🍽️ Hunza Soup, Chapshuro, Apricot products\n\n**Travel Tips:**\n✓ Carry cash (limited ATMs)\n✓ Book hotels in advance\n✓ Respect local culture\n✓ Try local cuisine\n\nNeed a detailed itinerary?`;
    }

    // Skardu specific
    if (query.includes('skardu')) {
      return `🏔️ **Skardu - Gateway to K2**\n\n**Why Visit Skardu?**\nHome to some of world's highest peaks, pristine lakes, and adventure opportunities.\n\n**Must-Visit Places:**\n• Shangrila Resort (Lower Kachura Lake)\n• Upper Kachura Lake\n• Satpara Lake\n• Deosai Plains (Land of Giants)\n• Shigar Fort\n• Manthoka Waterfall\n\n**Adventure Activities:**\n🏔️ Trekking to K2 Base Camp\n🚣 Boating in lakes\n📸 Photography tours\n🏕️ Camping in Deosai\n\n**How to Reach:**\n• By Air: PIA flights from Islamabad (1 hour)\n• By Road: 24 hours from Islamabad via KKH\n\n**Budget (5 days, 2 people):**\n• Transport: Rs. 30,000-50,000\n• Stay: Rs. 20,000-35,000\n• Food: Rs. 12,000-18,000\n**Total: Rs. 62,000-103,000**\n\n**Best Time:** May-September\n\nWant hotel recommendations?`;
    }

    // Swat specific
    if (query.includes('swat')) {
      return `🌲 **Swat Valley - Switzerland of Pakistan**\n\n**Overview:**\nSwat offers lush green valleys, rivers, waterfalls, and rich Buddhist heritage.\n\n**Top Destinations:**\n• Malam Jabba - Ski resort\n• Kalam Valley - Scenic beauty\n• Mahodand Lake - Crystal clear\n• Ushu Forest - Dense pine forests\n• Fizagat Park - Family spot\n• Buddhist Stupas - Historical sites\n\n**Activities:**\n⛷️ Skiing (winter)\n🎣 Trout fishing\n🚶 Nature walks\n🏛️ Historical tours\n\n**Distance from Major Cities:**\n• Islamabad: 250 km (5 hours)\n• Peshawar: 170 km (3 hours)\n\n**Budget (4 days, 2 people):**\n• Transport: Rs. 15,000-20,000\n• Hotels: Rs. 12,000-20,000\n• Food: Rs. 8,000-12,000\n**Total: Rs. 35,000-52,000**\n\n**Best Time:** March-October\n\n**Safety:** Generally safe, check current situation\n\nNeed a detailed itinerary?`;
    }

    // Murree specific
    if (query.includes('murree')) {
      return `🌲 **Murree - Hill Station Classic**\n\n**Overview:**\nClosest hill station to Islamabad/Rawalpindi, perfect for quick getaways.\n\n**Popular Spots:**\n• Mall Road - Shopping & food\n• Pindi Point - Panoramic views\n• Kashmir Point - Scenic viewpoint\n• Patriata (New Murree) - Chair lift\n• Ayubia National Park - Nature trails\n• Nathia Gali - Peaceful retreat\n\n**Best For:**\n👨‍👩‍👧‍👦 Family trips\n❄️ Snow in winter\n🏃 Quick weekend getaway\n\n**Distance:** 60 km from Islamabad (2 hours)\n\n**Budget (2 days, 4 people):**\n• Transport: Rs. 8,000-12,000\n• Hotel: Rs. 10,000-20,000\n• Food: Rs. 6,000-10,000\n**Total: Rs. 24,000-42,000**\n\n**Peak Season:** December-February (snow)\n**Off Season:** March-November (less crowded)\n\n**Tips:**\n⚠️ Very crowded on weekends\n⚠️ Book hotels in advance\n⚠️ Carry warm clothes\n⚠️ Traffic jams common\n\nWant hotel recommendations?`;
    }

    // Default response
    return `I'd be happy to help you with that! 😊\n\nI can provide detailed information about:\n\n🗺️ **Trip Planning**\n• Custom itineraries\n• Budget estimates\n• Best routes\n\n🏨 **Accommodations**\n• Hotel recommendations\n• Budget to luxury options\n• Booking tips\n\n📍 **Destinations**\n• Hunza Valley\n• Skardu\n• Swat Valley\n• Murree\n• Naran Kaghan\n• And many more!\n\n🌤️ **Travel Info**\n• Best time to visit\n• Weather conditions\n• What to pack\n\nCould you please be more specific about what you'd like to know? For example:\n• "Plan a 5-day trip to Hunza"\n• "Best hotels in Skardu"\n• "Route from Lahore to Swat"\n• "When to visit Murree"`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'ai',
        text: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      text: 'Chat cleared! How can I help you plan your next adventure? 🗺️',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/ai-planner')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back to AI Planner</span>
          </button>
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span>🗑️</span>
            <span>Clear Chat</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            AI Travel Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Your intelligent companion for exploring Pakistan
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
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm"
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
          style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}
        >
          {/* Messages */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}>
                          {message.role === 'user' ? '👤' : '🤖'}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`rounded-2xl px-5 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-emerald-100' : 'text-gray-500'}`}>
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-none px-5 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about destinations, hotels, routes, or anything..."
                  className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send 🚀
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Tip: Ask specific questions for better recommendations
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
