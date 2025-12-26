import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { INITIAL_SPOTS } from '../data';
import { Spot } from '../types';

export const Explore = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filtered, setFiltered] = useState<Spot[]>([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    setSpots(INITIAL_SPOTS);
    setFiltered(INITIAL_SPOTS);
  }, []);

  useEffect(() => {
    let res = spots;
    if (search) {
      const lowerSearch = search.toLowerCase();
      res = res.filter(s => s.name.toLowerCase().includes(lowerSearch) || s.tags.some(t => t.toLowerCase().includes(lowerSearch)));
    }
    if (region !== 'All') {
      res = res.filter(s => s.region === region);
    }
    setFiltered(res);
  }, [search, region, spots]);

  const handlePlanTrip = (spot: Spot) => {
    navigate(`/checkout?spotId=${spot.id}`);
  };

  const regions = Array.from(new Set(spots.map(s => s.region)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Explore Pakistan</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Search mountains, lakes..."
            className="border p-2 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="border p-2 rounded-lg bg-white"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="All">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(spot => (
          <motion.div 
            layout
            key={spot.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <div className="h-48 bg-gray-200 relative shrink-0">
              <img 
                src={spot.imageUrl} 
                alt={spot.name} 
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image')}
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow">
                ★ {spot.rating}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{spot.name}</h3>
                  <p className="text-sm text-emerald-600 mb-2">{spot.region}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{spot.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {spot.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <button 
                onClick={() => handlePlanTrip(spot)}
                className="w-full py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 transition-colors mt-auto shadow-sm"
              >
                + Add to Plan
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No places found matching your criteria.
        </div>
      )}
    </div>
  );
};
