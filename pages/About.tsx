import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About TripWise PK</h1>
        <p className="text-xl text-gray-500">Revolutionizing tourism in Pakistan through technology.</p>
      </motion.div>

      <div className="space-y-12">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-emerald-800">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            TripWise Pakistan was born from a passion to showcase the breathtaking beauty of Pakistan to the world. 
            From the majestic peaks of the Karakoram to the pristine beaches of Balochistan, our goal is to make 
            travel accessible, safe, and seamless for everyone. We combine local expertise with cutting-edge AI 
            technology to help you plan the perfect itinerary.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2 text-emerald-900">For Travelers</h3>
                <p className="text-emerald-800 text-sm">
                    We provide curated guides, reliable booking for hotels and transport, and a community platform 
                    to share your stories.
                </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2 text-blue-900">For Locals</h3>
                <p className="text-blue-800 text-sm">
                    We empower local business owners, guides, and hosts by connecting them directly with 
                    tourists, fostering sustainable economic growth.
                </p>
            </div>
        </section>
      </div>
    </div>
  );
};
