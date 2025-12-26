import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getHotels, getCars, updateHotel, updateCar } from '../mockService';
import { Hotel, Car } from '../types';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'hotels' | 'cars'>('hotels');
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit States
  const [editPrice, setEditPrice] = useState<number>(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    getHotels().then(setHotels);
    getCars().then(setCars);
  };

  const startEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice);
  };

  const saveEditHotel = async (hotel: Hotel) => {
    await updateHotel({ ...hotel, pricePerNight: editPrice });
    setEditingId(null);
    loadData();
  };

  const saveEditCar = async (car: Car) => {
    await updateCar({ ...car, pricePerDay: editPrice });
    setEditingId(null);
    loadData();
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Manage prices and listings</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium">Logged in as {user.name}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
          onClick={() => setActiveTab('hotels')}
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'hotels' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Manage Hotels
        </button>
        <button 
          onClick={() => setActiveTab('cars')}
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'cars' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Manage Transport
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="p-4">Name / Model</th>
                <th className="p-4">Location / Type</th>
                <th className="p-4">Current Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeTab === 'hotels' ? (
                hotels.map(hotel => (
                  <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{hotel.name}</td>
                    <td className="p-4 text-gray-500">{hotel.location}</td>
                    <td className="p-4">
                      {editingId === hotel.id ? (
                        <input 
                          type="number" 
                          value={editPrice} 
                          onChange={(e) => setEditPrice(parseInt(e.target.value))}
                          className="w-32 border border-emerald-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        <span className="font-bold text-emerald-700">PKR {hotel.pricePerNight.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {editingId === hotel.id ? (
                        <div className="flex justify-end gap-2">
                           <button onClick={() => saveEditHotel(hotel)} className="text-white bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700">Save</button>
                           <button onClick={() => setEditingId(null)} className="text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(hotel.id, hotel.pricePerNight)} className="text-emerald-600 hover:underline font-medium">Edit Price</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                cars.map(car => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{car.model}</td>
                    <td className="p-4 text-gray-500">{car.type}</td>
                    <td className="p-4">
                      {editingId === car.id ? (
                        <input 
                          type="number" 
                          value={editPrice} 
                          onChange={(e) => setEditPrice(parseInt(e.target.value))}
                          className="w-32 border border-emerald-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        <span className="font-bold text-emerald-700">PKR {car.pricePerDay.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {editingId === car.id ? (
                        <div className="flex justify-end gap-2">
                           <button onClick={() => saveEditCar(car)} className="text-white bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700">Save</button>
                           <button onClick={() => setEditingId(null)} className="text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(car.id, car.pricePerDay)} className="text-emerald-600 hover:underline font-medium">Edit Price</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
