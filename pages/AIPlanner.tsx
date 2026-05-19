import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const AIPlanner = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Smart Itinerary Planner',
      description: 'Plan your complete trip with AI-generated schedule, cost estimate, route guidance, and stay recommendations.',
      icon: '🗺️',
      gradient: 'from-emerald-500 to-teal-600',
      route: '/planner/itinerary'
    },
    {
      title: 'AI Travel Assistant',
      description: 'Chat with AI to get instant travel guidance, destination suggestions, route help, and hotel recommendations.',
      icon: '💬',
      gradient: 'from-blue-500 to-indigo-600',
      route: '/planner/chat'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Ask AI Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent travel companion for exploring Pakistan
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                   style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full">
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${card.gradient} p-8 text-white`}>
                  <div className="text-6xl mb-4">{card.icon}</div>
                  <h2 className="text-2xl font-bold">{card.title}</h2>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {card.description}
                  </p>

                  <button
                    onClick={() => navigate(card.route)}
                    className={`w-full bg-gradient-to-r ${card.gradient} text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                  >
                    {index === 0 ? 'Start Planning' : 'Start Chat'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '💰', label: 'Budget Estimation' },
              { icon: '🏨', label: 'Hotel Suggestions' },
              { icon: '🛣️', label: 'Route Guidance' },
              { icon: '📍', label: 'Tourist Spots' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="text-4xl mb-2">{feature.icon}</div>
                <p className="text-sm font-medium text-gray-700">{feature.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
