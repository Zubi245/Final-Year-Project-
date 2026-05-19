import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageKitUpload } from '../components/ImageKitUpload';

interface Car {
  _id: string;
  carModel: string;
  type: string;
  pricePerDay: number;
  imageUrl: string;
  exteriorImages: Array<{ url: string; fileId: string }>;
  interiorImages: Array<{ url: string; fileId: string }>;
  features: string[];
  seats: number;
  transmission: string;
  fuelType: string;
  availability: boolean;
}

export function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({
    carModel: '',
    type: 'Sedan',
    pricePerDay: 0,
    features: '',
    seats: 5,
    transmission: 'Manual',
    fuelType: 'Petrol',
    availability: true
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [exteriorImages, setExteriorImages] = useState<File[]>([]);
  const [interiorImages, setInteriorImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const carTypes = ['Sedan', 'SUV', '4x4', 'Van'];
  const transmissionTypes = ['Manual', 'Automatic'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

  useEffect(() => {
    fetchCars();
  }, [currentPage]);

  const fetchCars = async () => {
    const token = localStorage.getItem('accessToken');
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/cars?page=${currentPage}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = await response.json();
      if (data.success) {
        setCars(data.cars);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem('accessToken');
    const formDataToSend = new FormData();

    formDataToSend.append('carModel', formData.carModel);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('pricePerDay', formData.pricePerDay.toString());
    formDataToSend.append('seats', formData.seats.toString());
    formDataToSend.append('transmission', formData.transmission);
    formDataToSend.append('fuelType', formData.fuelType);
    formDataToSend.append('availability', formData.availability.toString());
    formDataToSend.append('features', JSON.stringify(formData.features.split(',').map(f => f.trim()).filter(Boolean)));

    if (mainImage) formDataToSend.append('mainImage', mainImage);
    exteriorImages.forEach(img => formDataToSend.append('exteriorImages', img));
    interiorImages.forEach(img => formDataToSend.append('interiorImages', img));

    try {
      const url = editingCar
        ? `http://localhost:5000/api/admin/cars/${editingCar._id}`
        : 'http://localhost:5000/api/admin/cars';

      const response = await fetch(url, {
        method: editingCar ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowModal(false);
        resetForm();
        fetchCars();
      } else {
        alert(data.message || 'Failed to save car');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save car');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        alert('Car deleted successfully');
        fetchCars();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete car');
    }
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setFormData({
      carModel: car.carModel,
      type: car.type,
      pricePerDay: car.pricePerDay,
      features: car.features.join(', '),
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuelType,
      availability: car.availability
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      carModel: '',
      type: 'Sedan',
      pricePerDay: 0,
      features: '',
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
      availability: true
    });
    setMainImage(null);
    setExteriorImages([]);
    setInteriorImages([]);
    setEditingCar(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Cars Management</h1>
            <p className="text-gray-600">Manage transport vehicles with images</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Car
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {cars.map((car) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={car.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={car.carModel}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{car.carModel}</h3>
                        <p className="text-sm text-orange-600">{car.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        car.availability
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {car.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>👥 {car.seats} Seats</span>
                        <span>•</span>
                        <span>⚙️ {car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⛽ {car.fuelType}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      Rs. {car.pricePerDay.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">/day</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(car)}
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCar ? 'Edit Car' : 'Add New Car'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Car Model *</label>
                      <input
                        type="text"
                        required
                        value={formData.carModel}
                        onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="e.g. Toyota Corolla 2023"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        {carTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price/Day (Rs.) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seats *</label>
                      <input
                        type="number"
                        required
                        min="2"
                        max="20"
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                      <select
                        required
                        value={formData.transmission}
                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        {transmissionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                      <select
                        required
                        value={formData.fuelType}
                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        {fuelTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      <input
                        type="text"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="AC, GPS, Bluetooth"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="availability"
                      checked={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="availability" className="text-sm font-medium text-gray-700">
                      Available for Rent
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                    <ImageKitUpload
                      onUpload={(files) => setMainImage(files[0])}
                      multiple={false}
                      label="Upload Main Image"
                      existingImages={editingCar?.imageUrl ? [editingCar.imageUrl] : []}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exterior Images</label>
                    <ImageKitUpload
                      onUpload={(files) => setExteriorImages(files)}
                      multiple={true}
                      maxFiles={5}
                      label="Upload Exterior Images (Max 5)"
                      existingImages={editingCar?.exteriorImages.map(img => img.url) || []}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interior Images</label>
                    <ImageKitUpload
                      onUpload={(files) => setInteriorImages(files)}
                      multiple={true}
                      maxFiles={5}
                      label="Upload Interior Images (Max 5)"
                      existingImages={editingCar?.interiorImages.map(img => img.url) || []}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : (editingCar ? 'Update Car' : 'Create Car')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
