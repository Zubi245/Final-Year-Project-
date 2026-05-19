import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HOTELS } from '../data';
import { Hotel } from '../types';

export const Hotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filtered, setFiltered] = useState<Hotel[]>([]);
  const [locationFilter, setLocationFilter] = useState('All');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const [checkInDate, setCheckInDate] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    setHotels(HOTELS);
    setFiltered(HOTELS);
  }, []);

  useEffect(() => {
    if (locationFilter === 'All') setFiltered(hotels);
    else setFiltered(hotels.filter(h => h.location === locationFilter));
  }, [locationFilter, hotels]);

  const uniqueLocations = Array.from(new Set(hotels.map(h => h.location)));

  const handleBook = () => {
    if (!selectedHotel) return;
    if (!checkInDate) {
      alert("Please select a check-in date.");
      return;
    }
    const totalCost = selectedHotel.pricePerNight;
    navigate('/payment', { 
      state: { 
        type: 'hotel',
        item: selectedHotel,
        details: { date: checkInDate, guests },
        total: totalCost
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Stay in Comfort</h1>
        <select 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border rounded-lg bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Locations</option>
          {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(hotel => (
          <motion.div 
            key={hotel.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 relative">
              <img 
                src={hotel.imageUrl} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image')}
              />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm font-bold">
                PKR {hotel.pricePerNight.toLocaleString()} / night
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                <span className="flex items-center text-amber-500 text-sm">★ {hotel.rating}</span>
              </div>
              <p className="text-emerald-600 text-sm mb-3">📍 {hotel.location}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.amenities.map(a => (
                  <span key={a} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{a}</span>
                ))}
              </div>
              <button 
                onClick={() => setSelectedHotel(hotel)}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedHotel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold mb-2">Confirm Booking</h2>
              <p className="text-gray-600 mb-4">You are booking <strong>{selectedHotel.name}</strong></p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Check-in Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Guests</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {[1,2,3,4,5].map(g => <option key={g} value={g}>{g} Guest{g>1?'s':''}</option>)}
                  </select>
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Price per night</span>
                    <span>PKR {selectedHotel.pricePerNight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1 mt-1">
                    <span>Total (Est. 1 Night)</span>
                    <span>PKR {selectedHotel.pricePerNight.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedHotel(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBook}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 flex justify-center items-center"
                >
                  Proceed to Pay
                </button>
              </div>
              <p className="text-xs text-center mt-4 text-gray-400">Mock Payment: No real money is processed.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
