import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000);
        setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Mission */}
        <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-4">
                <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>TripWise<span className="text-emerald-500">PK</span></span>
            </div>
          <p className="text-sm text-gray-400 mb-6">
            Empowering travelers to discover the hidden gems of Pakistan with AI-driven planning and seamless booking.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-500 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Facebook</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4">Discover</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-emerald-400 transition-colors">Destinations</Link></li>
            <li><Link to="/map" className="hover:text-emerald-400 transition-colors">Interactive Map</Link></li>
            <li><Link to="/ai-planner" className="hover:text-emerald-400 transition-colors">AI Planner</Link></li>
            <li><Link to="/community" className="hover:text-emerald-400 transition-colors">Traveler Community</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-bold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link to="/hotels" className="hover:text-emerald-400 transition-colors">Partner Hotels</Link></li>
            <li><Link to="/admin" className="hover:text-emerald-400 transition-colors">Admin Login</Link></li>
            <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-bold mb-4">Stay Updated</h3>
          <p className="text-xs text-gray-500 mb-4">Join our newsletter for the best deals and travel guides.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
                type="submit"
                className={`px-4 py-2 rounded font-bold transition-colors ${subscribed ? 'bg-green-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
            >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 Trip Wise Pakistan. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
             <span>Privacy Policy</span>
             <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
};
