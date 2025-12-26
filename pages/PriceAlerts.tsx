import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const PriceAlerts = () => {
  const [email, setEmail] = useState('');
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'Flight to Skardu', drop: '20% OFF', oldPrice: 'PKR 45,000', newPrice: 'PKR 36,000', date: '2 hours ago' },
    { id: 2, title: 'Pearl Continental Bhurban', drop: '15% OFF', oldPrice: 'PKR 35,000', newPrice: 'PKR 29,750', date: '1 day ago' },
    { id: 3, title: 'Hunza Glamping', drop: '30% OFF', oldPrice: 'PKR 20,000', newPrice: 'PKR 14,000', date: '3 days ago' },
  ]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Subscribed ${email} to price alerts!`);
    setEmail('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🔥 Hot Price Drops</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Don't miss out on seasonal discounts for hotels, flights, and tour packages.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Active Alerts List */}
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Recent Drops</h2>
          {alerts.map((alert) => (
            <motion.div 
              key={alert.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-gray-800">{alert.title}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="line-through mr-2">{alert.oldPrice}</span>
                  <span className="text-emerald-600 font-bold text-lg">{alert.newPrice}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{alert.date}</p>
              </div>
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                {alert.drop}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Box */}
        <div className="bg-emerald-900 text-white p-8 rounded-2xl flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Never Pay Full Price</h2>
          <p className="text-emerald-100 mb-6">
            Get instant notifications when prices drop for your favorite destinations in Northern Pakistan.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
              Set Alert
            </button>
          </form>
          <p className="text-xs text-emerald-300 mt-4 text-center">We respect your inbox. No spam.</p>
        </div>
      </div>
    </div>
  );
};