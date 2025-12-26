
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSpots } from '../mockService';
import { Spot } from '../types';

interface Package {
  id: string;
  name: string;
  days: number;
  multiplier: number;
  description: string;
}

export const Checkout = () => {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Booking State
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('p2');

  const packages: Package[] = [
    { id: 'p1', name: 'Short & Sweet', days: 3, multiplier: 1, description: 'Quick weekend getaway including main sights.' },
    { id: 'p2', name: 'Standard Explorer', days: 5, multiplier: 1.6, description: 'Complete tour with guide and leisure time.' },
    { id: 'p3', name: 'Ultimate Adventure', days: 10, multiplier: 3.0, description: 'Deep dive with trekking, local experiences and luxury stays.' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('spotId');
    if (id) {
      getSpots().then(data => {
        const found = data.find(s => s.id === id);
        setSpot(found || null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [location.search]);

  // Mock Base Price Calculator based on Region
  const getBasePrice = (region: string) => {
    switch(region) {
      case 'Gilgit-Baltistan': return 25000;
      case 'Northern Areas': return 22000;
      case 'Balochistan': return 18000;
      case 'Punjab': return 12000;
      case 'Sindh': return 15000;
      default: return 10000;
    }
  };

  const calculateTotal = () => {
    if (!spot) return 0;
    const base = getBasePrice(spot.region);
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (!pkg) return 0;
    return base * pkg.multiplier * guests;
  };

  const handleProceedToPayment = () => {
    if (!date) {
        alert("Please select a start date for your trip.");
        return;
    }
    const pkg = packages.find(p => p.id === selectedPackageId);
    
    // Navigate to Payment Page with State
    navigate('/payment', { 
      state: { 
        type: 'trip',
        item: spot,
        details: {
            pkgName: pkg?.name,
            days: pkg?.days,
            guests: guests,
            date: date
        }, 
        total: calculateTotal() 
      } 
    });
  };

  if (loading) return <div className="p-10 text-center">Loading booking details...</div>;
  if (!spot) return <div className="p-10 text-center">Spot not found. Please return to Explore.</div>;

  const totalCost = calculateTotal();
  const selectedPkg = packages.find(p => p.id === selectedPackageId);
  
  // Use 'en-CA' for YYYY-MM-DD format in local timezone to prevent issues with date picker
  // This ensures 'today' is actually today in the user's timezone, not UTC 'yesterday'
  const today = new Date().toLocaleDateString('en-CA');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-emerald-600 font-medium mb-4 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Explore
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Plan Your Trip</h1>
        <p className="text-gray-500">Customize your experience for <span className="text-emerald-600 font-bold">{spot.name}</span></p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Details Form */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
                Trip Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Start Date Input - Enhanced */}
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">Start Date</label>
                <div className="relative w-full transition-transform duration-200 hover:-translate-y-1">
                    {/* Input with onClick handler to force picker open */}
                    <input 
                      type="date" 
                      min={today}
                      required
                      className="peer w-full bg-white border-2 border-gray-200 text-gray-900 text-lg font-medium rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:ring-offset-2 block p-4 pl-12 outline-none transition-all cursor-pointer hover:border-emerald-300 shadow-sm" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onClick={(e) => {
                        // Safely trigger native picker
                        try {
                          if (e.currentTarget.showPicker) {
                            e.currentTarget.showPicker();
                          }
                        } catch (err) {
                          // Fallback for browsers that don't support showPicker (handled natively by input type=date)
                        }
                      }}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-20 text-gray-400 peer-focus:text-emerald-600 peer-hover:text-emerald-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 pl-1 group-hover:text-emerald-600 transition-colors font-medium">Click to select departure date</p>
              </div>

              {/* Guests Input - Visually Attractive & Highlighted */}
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">Number of Guests</label>
                <div className="relative transition-transform duration-200 hover:-translate-y-1">
                    <select 
                        className="peer w-full bg-white border-2 border-gray-200 text-gray-900 text-lg font-bold rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:ring-offset-2 block w-full p-4 pl-12 outline-none appearance-none transition-all cursor-pointer shadow-sm hover:border-emerald-300 hover:shadow-md"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                    >
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                        ))}
                    </select>
                    {/* User Icon - Changes color on hover/focus */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 peer-focus:text-emerald-600 peer-hover:text-emerald-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    {/* Chevron Icon - Changes color on hover/focus */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 peer-focus:text-emerald-600 peer-hover:text-emerald-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 pl-1 group-hover:text-emerald-600 transition-colors font-medium">Select total travelers</p>
              </div>
            </div>
          </section>

          {/* Package Selection */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                Select Your Package
            </h2>
            <div className="space-y-4">
              {packages.map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center ${selectedPackageId === pkg.id ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 ring-offset-2' : 'border-gray-100 hover:border-emerald-300 hover:bg-gray-50'}`}
                >
                  <div className="flex items-start gap-4">
                     <div className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center ${selectedPackageId === pkg.id ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                        {selectedPackageId === pkg.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900 text-lg">{pkg.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">{pkg.description}</p>
                     </div>
                  </div>
                  <div className="mt-3 sm:mt-0 pl-10 sm:pl-0 text-right">
                     <span className="block font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded text-sm whitespace-nowrap">{pkg.days} Days Tour</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-4">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Booking Summary</h2>
            
            <div className="flex gap-4 mb-6">
              <img src={spot.imageUrl} alt={spot.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" />
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">{spot.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{spot.region}</p>
                <div className="mt-2 text-xs font-bold text-amber-500 flex items-center gap-1">
                   <span>★</span> {spot.rating} (Excellent)
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 pb-6 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Selected Package</span>
                <span className="font-medium text-gray-900 text-right">{selectedPkg?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium text-gray-900">{selectedPkg?.days} Days</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span className="font-medium text-gray-900">{guests} People</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date</span>
                <span className={`font-medium ${date ? 'text-gray-900' : 'text-red-500'}`}>{date || 'Select a date'}</span>
              </div>
            </div>

            <div className="py-6">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 font-medium">Estimated Total</span>
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">PKR {(totalCost / 1000).toFixed(1)}k</span>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1">PKR {totalCost.toLocaleString()}</p>
            </div>

            <button 
              onClick={handleProceedToPayment}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all transform active:scale-95 shadow-lg shadow-emerald-200"
            >
              Proceed to Payment
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
              Step 1 of 2: Review & Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
