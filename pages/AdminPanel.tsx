import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  getHotels, 
  getCars, 
  getSpots,
  createSpotWithImage,
  updateSpotWithImage,
  deleteSpot,
  createHotelWithImage,
  updateHotelWithImage,
  deleteHotel,
  createCarWithImage,
  updateCarWithImage,
  deleteCar
} from '../apiService';
import { Hotel, Car, Spot } from '../types';
import {
  getAllUsers,
  getDashboardStats,
  blockUser,
  unblockUser,
  deleteUser as deleteUserAdmin,
  changeUserRole,
  User,
  DashboardStats as Stats
} from '../services/adminService';

type TabType = 'spots' | 'hotels' | 'cars' | 'users';
type ModalMode = 'create' | 'edit' | null;

export const AdminPanel = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>('spots');
  
  // Data states
  const [spots, setSpots] = useState<Spot[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  
  // Modal states
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth');
      return;
    }
    loadData();
    if (activeTab === 'users') {
      loadUsers();
      loadStats();
    }
  }, [user, navigate, activeTab, currentPage, searchQuery, filterRole, filterProvider]);

  const loadData = async () => {
    try {
      const [spotsData, hotelsData, carsData] = await Promise.all([
        getSpots(),
        getHotels(),
        getCars()
      ]);
      setSpots(spotsData);
      setHotels(hotelsData);
      setCars(carsData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getAllUsers({
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
        role: filterRole || undefined,
        authProvider: filterProvider || undefined
      });
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!confirm('Are you sure you want to block this user?')) return;
    try {
      await blockUser(userId);
      setSuccess('User blocked successfully');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId);
      setSuccess('User unblocked successfully');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unblock user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteUserAdmin(userId);
      setSuccess('User deleted successfully');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await changeUserRole(userId, newRole);
      setSuccess(`User role changed to ${newRole} successfully`);
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change role');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedItem(null);
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setError('');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const handleSubmitSpot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      
      if (modalMode === 'create' && !imageFile) {
        setError('Image is required');
        setLoading(false);
        return;
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (modalMode === 'create') {
        await createSpotWithImage(formData);
        setSuccess('Tourist spot created successfully!');
      } else if (modalMode === 'edit' && selectedItem) {
        await updateSpotWithImage(selectedItem.id, formData);
        setSuccess('Tourist spot updated successfully!');
      }
      
      await loadData();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitHotel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      
      if (modalMode === 'create' && !imageFile) {
        setError('Image is required');
        setLoading(false);
        return;
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (modalMode === 'create') {
        await createHotelWithImage(formData);
        setSuccess('Hotel created successfully!');
      } else if (modalMode === 'edit' && selectedItem) {
        await updateHotelWithImage(selectedItem.id, formData);
        setSuccess('Hotel updated successfully!');
      }
      
      await loadData();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      
      if (modalMode === 'create' && !imageFile) {
        setError('Image is required');
        setLoading(false);
        return;
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (modalMode === 'create') {
        await createCarWithImage(formData);
        setSuccess('Car created successfully!');
      } else if (modalMode === 'edit' && selectedItem) {
        await updateCarWithImage(selectedItem.id, formData);
        setSuccess('Car updated successfully!');
      }
      
      await loadData();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: TabType) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      if (type === 'spots') await deleteSpot(id);
      else if (type === 'hotels') await deleteHotel(id);
      else if (type === 'cars') await deleteCar(id);
      
      setSuccess('Item deleted successfully!');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Manage your travel listings</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-medium">Logged in as {user.name}</span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b overflow-x-auto">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          👥 Users
        </button>
        <button 
          onClick={() => setActiveTab('spots')}
          className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'spots' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🏔️ Tourist Spots
        </button>
        <button 
          onClick={() => setActiveTab('hotels')}
          className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'hotels' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🏨 Hotels
        </button>
        <button 
          onClick={() => setActiveTab('cars')}
          className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'cars' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🚗 Rental Cars
        </button>
      </div>

      {/* Dashboard Stats - Only for Users Tab */}
      {activeTab === 'users' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-emerald-600">{stats.stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-purple-600">{stats.stats.totalAdmins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">{stats.stats.verifiedUsers}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-orange-600">{stats.stats.recentUsers}</div>
            <div className="text-sm text-gray-600">New (7 days)</div>
          </div>
        </div>
      )}

      {/* Search and Filters - Only for Users Tab */}
      {activeTab === 'users' && (
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filterProvider}
            onChange={(e) => {
              setFilterProvider(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">All Providers</option>
            <option value="local">Local</option>
            <option value="google">Google</option>
          </select>
        </div>
      )}

      {/* Add New Button - Hide for Users Tab */}
      {activeTab !== 'users' && (
        <div className="mb-4">
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            + Add New {activeTab === 'spots' ? 'Spot' : activeTab === 'hotels' ? 'Hotel' : 'Car'}
          </button>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        user.authProvider === 'google' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.authProvider === 'google' ? '🔵 Google' : '🔐 Local'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {user.emailVerified ? (
                          <span className="text-xs text-emerald-600">✅ Verified</span>
                        ) : (
                          <span className="text-xs text-yellow-600">⚠️ Not Verified</span>
                        )}
                        {user.isBlocked && (
                          <span className="text-xs text-red-600">🚫 Blocked</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {user.isBlocked ? (
                          <button
                            onClick={() => handleUnblockUser(user._id)}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUser(user._id)}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                          >
                            Block
                          </button>
                        )}
                        <button
                          onClick={() => handleChangeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                          className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                        >
                          {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'spots' && spots.map(spot => (
          <div key={spot.id} className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-shadow">
            <img src={spot.imageUrl} alt={spot.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{spot.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{spot.region}</p>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{spot.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(spot)}
                  className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(spot.id, 'spots')}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'hotels' && hotels.map(hotel => (
          <div key={hotel.id} className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-shadow">
            <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
              <p className="text-emerald-700 font-bold mb-3">PKR {hotel.pricePerNight.toLocaleString()}/night</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(hotel)}
                  className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel.id, 'hotels')}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'cars' && cars.map(car => (
          <div key={car.id} className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-shadow">
            <img src={car.imageUrl} alt={car.carModel} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{car.carModel}</h3>
              <p className="text-gray-600 text-sm mb-2">{car.type}</p>
              <p className="text-emerald-700 font-bold mb-3">PKR {car.pricePerDay.toLocaleString()}/day</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(car)}
                  className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id, 'cars')}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {modalMode === 'create' ? 'Add New' : 'Edit'} {activeTab === 'spots' ? 'Tourist Spot' : activeTab === 'hotels' ? 'Hotel' : 'Car'}
              </h2>

              {/* Spot Form */}
              {activeTab === 'spots' && (
                <form onSubmit={handleSubmitSpot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedItem?.name}
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Region</label>
                    <select
                      name="region"
                      defaultValue={selectedItem?.region}
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Northern Areas">Northern Areas</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Azad Kashmir">Azad Kashmir</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedItem?.description}
                      required
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      defaultValue={selectedItem?.rating || 0}
                      min="0"
                      max="5"
                      step="0.1"
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image {modalMode === 'edit' && '(Leave empty to keep current)'}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Hotel Form */}
              {activeTab === 'hotels' && (
                <form onSubmit={handleSubmitHotel} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedItem?.name}
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={selectedItem?.location}
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price Per Night (PKR)</label>
                    <input
                      type="number"
                      name="pricePerNight"
                      defaultValue={selectedItem?.pricePerNight}
                      required
                      min="0"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      defaultValue={selectedItem?.rating || 0}
                      min="0"
                      max="5"
                      step="0.1"
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image {modalMode === 'edit' && '(Leave empty to keep current)'}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Car Form */}
              {activeTab === 'cars' && (
                <form onSubmit={handleSubmitCar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Car Model</label>
                    <input
                      type="text"
                      name="carModel"
                      defaultValue={selectedItem?.carModel}
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      name="type"
                      defaultValue={selectedItem?.type}
                      required
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="4x4">4x4</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price Per Day (PKR)</label>
                    <input
                      type="number"
                      name="pricePerDay"
                      defaultValue={selectedItem?.pricePerDay}
                      required
                      min="0"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image {modalMode === 'edit' && '(Leave empty to keep current)'}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
