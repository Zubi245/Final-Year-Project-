import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCars } from '../mockService';
import { Car } from '../types';

export const Transport = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [filtered, setFiltered] = useState<Car[]>([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Rental Form State
  const [rentalDays, setRentalDays] = useState(1);
  const [pickupDate, setPickupDate] = useState('');

  useEffect(() => {
    getCars().then(data => {
      setCars(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    if (typeFilter === 'All') {
      setFiltered(cars);
    } else {
      setFiltered(cars.filter(c => c.type === typeFilter));
    }
  }, [typeFilter, cars]);

  const uniqueTypes = Array.from(new Set(cars.map(c => c.type)));

  const handleRent = () => {
    if (!selectedCar) return;
    if (!pickupDate) {
        alert("Please select a pickup date.");
        return;
    }

    const totalCost = selectedCar.pricePerDay * rentalDays;

    navigate('/payment', { 
        state: { 
            type: 'car',
            item: selectedCar,
            details: {
                date: pickupDate,
                days: rentalDays
            },
            total: totalCost
        }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rent a Vehicle</h1>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded-lg bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Types</option>
          {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((car, idx) => (
          <motion.div 
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="h-48 overflow-hidden">
               <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{car.model}</h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">{car.type}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Starting from <span className="text-black font-bold text-lg">PKR {car.pricePerDay.toLocaleString()}</span> / day</p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                {car.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setSelectedCar(car)}
                className="w-full py-2 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Rent This Car
              </button>
            </div>
          </motion.div>
        ))}
      </div>

       {/* Rental Modal */}
       <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold mb-2">Confirm Rental</h2>
              <p className="text-gray-600 mb-4">You are renting <strong>{selectedCar.model}</strong></p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Pickup Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
                <div>
                   <label className="block text-sm text-gray-500 mb-1">Number of Days</label>
                   <select 
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value))}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                   >
                     {[1,2,3,4,5,7,10,14].map(d => <option key={d} value={d}>{d} Day{d>1?'s':''}</option>)}
                   </select>
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Price per day</span>
                    <span>PKR {selectedCar.pricePerDay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1 mt-1">
                    <span>Total (Est.)</span>
                    <span>PKR {(selectedCar.pricePerDay * rentalDays).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedCar(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRent}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 flex justify-center items-center"
                >
                  Proceed to Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};