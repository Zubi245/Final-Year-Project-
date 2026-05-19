import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { AIPlanner } from './pages/AIPlanner';
import { ItineraryPlanner } from './pages/ItineraryPlanner';
import { AIChat } from './pages/AIChat';
import { Community } from './pages/Community';
import { Hotels } from './pages/Hotels';
import { Transport } from './pages/Transport';
import { MapPage } from './pages/MapPage';
import { PriceAlerts } from './pages/PriceAlerts';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { Auth } from './pages/Auth';
import { AuthReal } from './pages/AuthReal';
import { AuthUnified } from './pages/AuthUnified';
import { CompleteProfile } from './pages/CompleteProfile';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSpots } from './pages/AdminSpots';
import { AdminHotels } from './pages/AdminHotels';
import { AdminCars } from './pages/AdminCars';
import { AdminNewsletter } from './pages/AdminNewsletter';
import { About } from './pages/About';
import { Terms } from './pages/Terms';
import { GoogleCallback } from './pages/GoogleCallback';
import { initializeData } from './apiService';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthReal />} />
            <Route path="/auth-old" element={<Auth />} />
            <Route path="/auth/callback" element={<GoogleCallback />} />
            <Route path="/auth-unified" element={<AuthUnified />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/planner/itinerary" element={<ItineraryPlanner />} />
            <Route path="/planner/chat" element={<AIChat />} />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <PriceAlerts />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/spots" element={
              <AdminRoute>
                <AdminSpots />
              </AdminRoute>
            } />
            <Route path="/admin/hotels" element={
              <AdminRoute>
                <AdminHotels />
              </AdminRoute>
            } />
            <Route path="/admin/cars" element={
              <AdminRoute>
                <AdminCars />
              </AdminRoute>
            } />
            <Route path="/admin/newsletter" element={
              <AdminRoute>
                <AdminNewsletter />
              </AdminRoute>
            } />
          </Routes>
        </Layout>
      </HashRouter>
    </GoogleOAuthProvider>
  );
}
