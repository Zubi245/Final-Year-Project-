import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { AIPlanner } from './pages/AIPlanner';
import { Community } from './pages/Community';
import { Hotels } from './pages/Hotels';
import { Transport } from './pages/Transport';
import { MapPage } from './pages/MapPage';
import { PriceAlerts } from './pages/PriceAlerts';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { Auth } from './pages/Auth';
import { AdminPanel } from './pages/AdminPanel';
import { About } from './pages/About';
import { Terms } from './pages/Terms';
import { initializeData } from './mockService';

export default function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/alerts" element={<PriceAlerts />} />
          <Route path="/community" element={<Community />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}