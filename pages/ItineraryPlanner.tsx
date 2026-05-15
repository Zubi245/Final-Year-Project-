import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface TripPlan {
  totalCost: {
    transport: number;
    hotel: number;
    food: number;
    miscellaneous: number;
    total: number;
  };
  itinerary: Array<{
    day: number;
    title: string;
    activities: string[];
  }>;
  route: {
    distance: string;
    duration: string;
    overview: string;
  };
  nearbySpots: Array<{
    name: string;
    distance: string;
    description: string;
    image: string;
  }>;
  hotels: Array<{
    name: string;
    priceRange: string;
    rating: number;
    location: string;
  }>;
}

export const ItineraryPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departureCity: '',
    destinationProvince: '',
    touristSpot: '',
    travelers: 1,
    days: 1,
    budget: 'Standard',
    travelMode: 'Car'
  });
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const cities = ['Faisalabad', 'Lahore', 'Islamabad', 'Karachi', 'Multan', 'Peshawar', 'Quetta'];
  const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit Baltistan', 'Kashmir'];
  const touristSpots = [
    'Hunza Valley', 'Murree', 'Skardu', 'Naran', 'Swat Valley', 'Fairy Meadows',
    'Kaghan Valley', 'Neelum Valley', 'Chitral', 'Kalash Valley', 'Nathia Gali',
    'Shogran', 'Astore Valley', 'Deosai Plains', 'Rama Lake'
  ];

  const generatePlan = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const baseCost = formData.budget === 'Economy' ? 15000 : formData.budget === 'Standard' ? 30000 : 60000;
      const perDay = baseCost * formData.days;
      const perPerson = perDay * formData.travelers;

      const transportCost = formData.travelMode === 'Flight' ? perPerson * 0.4 : 
                           formData.travelMode === 'Car' ? perPerson * 0.25 : perPerson * 0.15;
      const hotelCost = perPerson * 0.35;
      const foodCost = perPerson * 0.20;
      const miscCost = perPerson * 0.10;

      const itinerary = Array.from({ length: formData.days }, (_, i) => ({
        day: i + 1,
        title: i === 0 ? 'Arrival & Check-in' : 
               i === formData.days - 1 ? 'Departure' : 
               `Explore ${formData.touristSpot}`,
        activities: i === 0 ? [
          `Depart from ${formData.departureCity}`,
          `Arrive at ${formData.touristSpot}`,
          'Hotel check-in',
          'Evening local market visit'
        ] : i === formData.days - 1 ? [
          'Morning breakfast',
          'Hotel checkout',
          'Souvenir shopping',
          `Return to ${formData.departureCity}`
        ] : [
          'Morning breakfast',
          'Visit main tourist attractions',
          'Lunch at local restaurant',
          'Adventure activities',
          'Evening photography session',
          'Dinner and rest'
        ]
      }));

      const nearbySpots = [
        {
          name: `${formData.touristSpot} Viewpoint`,
          distance: '2 km',
          description: 'Breathtaking panoramic views of the valley',
          image: 'https://picsum.photos/seed/spot1/400/300'
        },
        {
          name: 'Local Bazaar',
          distance: '1.5 km',
          description: 'Traditional handicrafts and local cuisine',
          image: 'https://picsum.photos/seed/spot2/400/300'
        },
        {
          name: 'Historical Fort',
          distance: '5 km',
          description: 'Ancient fort with rich cultural heritage',
          image: 'https://picsum.photos/seed/spot3/400/300'
        },
        {
          name: 'Nature Trail',
          distance: '3 km',
          description: 'Scenic hiking trail through pine forests',
          image: 'https://picsum.photos/seed/spot4/400/300'
        }
      ];

      const hotels = formData.budget === 'Economy' ? [
        { name: 'Budget Inn', priceRange: 'Rs. 2,000 - 3,000/night', rating: 3.5, location: `Near ${formData.touristSpot} Center` },
        { name: 'Traveler\'s Rest', priceRange: 'Rs. 2,500 - 3,500/night', rating: 3.8, location: 'Main Bazaar Area' },
        { name: 'Valley Guest House', priceRange: 'Rs. 1,800 - 2,800/night', rating: 3.2, location: 'Outskirts' }
      ] : formData.budget === 'Standard' ? [
        { name: 'Comfort Hotel', priceRange: 'Rs. 5,000 - 7,000/night', rating: 4.2, location: `${formData.touristSpot} Main Road` },
        { name: 'Mountain View Resort', priceRange: 'Rs. 6,000 - 8,000/night', rating: 4.5, location: 'Scenic Location' },
        { name: 'Pearl Continental', priceRange: 'Rs. 7,000 - 9,000/night', rating: 4.3, location: 'City Center' }
      ] : [
        { name: 'Luxury Mountain Resort', priceRange: 'Rs. 15,000 - 20,000/night', rating: 4.8, location: 'Premium Valley View' },
        { name: 'Royal Palace Hotel', priceRange: 'Rs. 18,000 - 25,000/night', rating: 4.9, location: 'Exclusive Area' },
        { name: 'Serena Hotel', priceRange: 'Rs. 20,000 - 30,000/night', rating: 5.0, location: 'Prime Location' }
      ];

      const distance = Math.floor(Math.random() * 400) + 200;
      const duration = Math.floor(distance / 60);

      setTripPlan({
        totalCost: {
          transport: Math.round(transportCost),
          hotel: Math.round(hotelCost),
          food: Math.round(foodCost),
          miscellaneous: Math.round(miscCost),
          total: Math.round(transportCost + hotelCost + foodCost + miscCost)
        },
        itinerary,
        route: {
          distance: `${distance} km`,
          duration: `${duration} hours`,
          overview: `Take ${formData.travelMode === 'Flight' ? 'a direct flight' : 
                    formData.travelMode === 'Car' ? 'the scenic highway route' : 
                    'the comfortable bus service'} from ${formData.departureCity} to ${formData.touristSpot}. ${
                    formData.travelMode === 'Car' ? 'Enjoy beautiful mountain views along the way.' : 
                    formData.travelMode === 'Bus' ? 'Multiple rest stops available.' : 
                    'Quick and convenient air travel.'}`
        },
        nearbySpots,
        hotels
      });

      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/ai-planner')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back to AI Planner</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Smart Itinerary Planner
          </h1>
          <p className="text-lg text-gray-600">
            Plan your perfect trip with AI-powered recommendations
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Details</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Departure City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Departure City *
              </label>
              <select
                value={formData.departureCity}
                onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Destination Province */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination Province *
              </label>
              <select
                value={formData.destinationProvince}
                onChange={(e) => setFormData({ ...formData, destinationProvince: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* Tourist Spot */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tourist Destination *
              </label>
              <select
                value={formData.touristSpot}
                onChange={(e) => setFormData({ ...formData, touristSpot: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Destination</option>
                {touristSpots.map(spot => (
                  <option key={spot} value={spot}>{spot}</option>
                ))}
              </select>
            </div>

            {/* Number of Travelers */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Travelers *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Number of Days */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Days *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Budget Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget Preference *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Economy">Economy</option>
                <option value="Standard">Standard</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Travel Mode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Travel Mode *
              </label>
              <select
                value={formData.travelMode}
                onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Bus">Bus</option>
                <option value="Car">Car</option>
                <option value="Flight">Flight</option>
              </select>
            </div>
          </div>

          <button
            onClick={generatePlan}
            disabled={!formData.departureCity || !formData.destinationProvince || !formData.touristSpot || isGenerating}
            className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Your Perfect Trip...
              </span>
            ) : (
              '✨ Generate Trip Plan'
            )}
          </button>
        </motion.div>

        {/* Generated Plan */}
        {tripPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Cost Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>💰</span> Estimated Total Cost
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-1">Transport</p>
                  <p className="text-2xl font-bold text-blue-900">Rs. {tripPlan.totalCost.transport.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <p className="text-sm text-purple-600 font-medium mb-1">Hotel</p>
                  <p className="text-2xl font-bold text-purple-900">Rs. {tripPlan.totalCost.hotel.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <p className="text-sm text-orange-600 font-medium mb-1">Food</p>
                  <p className="text-2xl font-bold text-orange-900">Rs. {tripPlan.totalCost.food.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                  <p className="text-sm text-pink-600 font-medium mb-1">Miscellaneous</p>
                  <p className="text-2xl font-bold text-pink-900">Rs. {tripPlan.totalCost.miscellaneous.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-white">
                <p className="text-lg font-medium mb-2">Total Trip Cost</p>
                <p className="text-4xl font-extrabold">Rs. {tripPlan.totalCost.total.toLocaleString()}</p>
                <p className="text-sm opacity-90 mt-2">For {formData.travelers} traveler(s) × {formData.days} day(s)</p>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📅</span> Day-by-Day Itinerary
              </h2>
              <div className="space-y-4">
                {tripPlan.itinerary.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-emerald-500 pl-6 py-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-r-xl"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Day {day.day}: {day.title}
                    </h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Route Guidance */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>🛣️</span> Route Guidance
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-1">Distance</p>
                  <p className="text-3xl font-bold text-blue-900">{tripPlan.route.distance}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-600 font-medium mb-1">Duration</p>
                  <p className="text-3xl font-bold text-purple-900">{tripPlan.route.duration}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-sm text-orange-600 font-medium mb-1">Mode</p>
                  <p className="text-3xl font-bold text-orange-900">{formData.travelMode}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed">{tripPlan.route.overview}</p>
              </div>
              <div className="mt-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
                <p className="text-gray-500 font-medium">🗺️ Map Integration Coming Soon</p>
              </div>
            </div>

            {/* Nearby Tourist Spots */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📍</span> Nearby Tourist Spots
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tripPlan.nearbySpots.map((spot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img src={spot.image} alt={spot.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1">{spot.name}</h3>
                      <p className="text-sm text-emerald-600 font-medium mb-2">📍 {spot.distance}</p>
                      <p className="text-sm text-gray-600">{spot.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended Hotels */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>🏨</span> Recommended Hotels
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {tripPlan.hotels.map((hotel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{hotel.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">{'⭐'.repeat(Math.floor(hotel.rating))}</span>
                        <span className="text-sm font-medium text-gray-600">{hotel.rating}</span>
                      </div>
                      <p className="text-emerald-600 font-semibold">{hotel.priceRange}</p>
                      <p className="text-sm text-gray-600">📍 {hotel.location}</p>
                    </div>
                    <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
