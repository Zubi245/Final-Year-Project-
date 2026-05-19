import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getSpots } from '../mockService';
import { Spot } from '../types';

export const Home = () => {
  const [featured, setFeatured] = useState<Spot[]>([]);
  const navigate = useNavigate();

  // Predefined images for Home featured spots
  const spotImages: Record<string, string> = {
    Hunza: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Hunza_Valley.jpg',
    FaisalMosque: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Faisal_Mosque.jpg',
    MohenjoDaro: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Mohenjo-daro_Excavation.jpg',
    AstolaIsland: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Astola_Island.jpg',
    Skardu: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Skardu_Valley.jpg',
    Gwadar: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Gwadar_Beach.jpg',
    LahoreFort: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Fort_in_Lahore.jpg',
    SwatValley: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Swat_Valley.jpg',
    K2: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/K2_Mountain_Pakistan.jpg'
  };

  useEffect(() => {
    getSpots().then(spots => {
      const updated = spots.slice(0, 9).map(spot => {
        let imageUrl = spot.imageUrl;
        if (!imageUrl) {
          const key = Object.keys(spotImages).find(k => spot.name.toLowerCase().includes(k.toLowerCase()));
          imageUrl = key ? spotImages[key] : 'https://via.placeholder.com/400x300?text=No+Image';
        }
        return { ...spot, imageUrl };
      });
      setFeatured(updated);
    });
  }, []);

  const categories = [
    { name: 'Mountaineering', icon: '🏔️', query: 'mountains' },
    { name: 'Historical Sites', icon: '🕌', query: 'history' },
    { name: 'Food Tours', icon: '🍛', query: 'food' },
    { name: 'Coastal Camping', icon: '⛺', query: 'beach' }
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-emerald-900 flex items-center justify-center text-center px-4 overflow-hidden rounded-bl-[3rem] shadow-xl">
        <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/id/1036/1200/800')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            Discover the Magic of Pakistan
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-xl text-emerald-50 mb-8"
          >
            From the peaks of Hunza to the beaches of Gwadar.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/ai-planner" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105">
              Ask AI Planner
            </Link>
            <Link to="/map" className="px-8 py-3 bg-white text-emerald-900 hover:bg-gray-100 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
              View Map
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <section className="bg-emerald-50 py-12 px-4 -mt-12 relative z-20 max-w-6xl mx-auto rounded-xl shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse by Experience</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={idx} 
                onClick={() => navigate(`/explore?search=${cat.query}`)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-100"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-700">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Trending Destinations */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Trending Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featured.map((spot, i) => (
            <motion.div 
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img src={spot.imageUrl} alt={spot.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{spot.region}</span>
                <h3 className="text-xl font-bold mt-2 text-gray-900">{spot.name}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{spot.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center text-amber-500">
                    ★ {spot.rating}
                  </span>
                  <Link to={`/explore?search=${spot.name}`} className="text-emerald-600 font-medium hover:underline">View Details →</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
