import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from './Footer';
import { getCurrentUser } from '../mockService';

const Logo = () => (
  <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-800 p-4 border-b border-gray-100">
    <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
    <span>TripWise<span className="text-emerald-500">PK</span></span>
  </div>
);

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
  icon?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, active, onClick, icon }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors text-sm font-medium ${active
        ? 'bg-emerald-100 text-emerald-800'
        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
      }`}
  >
    {icon && <span className="text-lg">{icon}</span>}
    {children}
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user from real backend auth (not mock service)
  const getUserFromAuth = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };
  
  const user = getUserFromAuth();

  // Check if current page is an auth page (no sidebar/footer needed)
  const authPages = [
    '/auth',
    '/auth-old',
    '/auth/callback',
    '/auth-unified',
    '/complete-profile',
    '/verify-email',
    '/forgot-password',
    '/reset-password'
  ];
  
  const isAuthPage = authPages.includes(location.pathname);

  // If it's an auth page, render without Layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Public links - always visible
  const publicLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🔭' },
    { path: '/map', label: 'Map', icon: '🗺️' },
    { path: '/hotels', label: 'Hotels', icon: '🏨' },
    { path: '/transport', label: 'Transport', icon: '🚗' },
  ];

  // Protected links - only visible when logged in
  const protectedLinks = [
    { path: '/ai-planner', label: 'AI Planner', icon: '🤖' },
    { path: '/alerts', label: 'Price Alerts', icon: '🔔' },
    { path: '/community', label: 'Community', icon: '👥' },
  ];

  // Admin link - only visible for admin users
  const adminLink = { path: '/admin', label: 'Admin Panel', icon: '⚙️' };

  // Build navigation links based on user status
  let navigationLinks = [...publicLinks];
  
  if (user) {
    // Add protected links if user is logged in
    navigationLinks = [...navigationLinks, ...protectedLinks];
    
    // Add admin link if user is admin
    if (user.role === 'admin') {
      navigationLinks = [...navigationLinks, adminLink];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-30">
        <Logo />
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin">
          {navigationLinks.map(l => (
            <NavLink
              key={l.path}
              to={l.path}
              active={location.pathname === l.path}
              icon={l.icon}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section in Sidebar */}
        <div className="p-4 border-t border-gray-100">
          {user ? (
            <div className="space-y-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-gray-800">{user.name || user.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{user.role || 'user'}</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/auth');
                  window.location.reload();
                }}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="block w-full text-center py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 text-sm font-bold transition-colors"
            >
              Sign In / Join
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header & Drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <Link to="/" className="font-bold text-emerald-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
          </svg>
          TripWisePK
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-xl flex flex-col"
            >
              <Logo />
              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navigationLinks.map(l => (
                  <NavLink
                    key={l.path}
                    to={l.path}
                    active={location.pathname === l.path}
                    onClick={() => setIsMobileOpen(false)}
                    icon={l.icon}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t space-y-2">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileOpen(false)} 
                      className="block w-full text-center py-2 bg-emerald-600 text-white rounded-lg font-medium"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        setIsMobileOpen(false);
                        navigate('/auth');
                        window.location.reload();
                      }}
                      className="w-full py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => setIsMobileOpen(false)} 
                    className="block w-full text-center py-2 bg-emerald-600 text-white rounded-lg font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full md:w-auto pt-16 md:pt-0 min-h-screen flex flex-col overflow-x-hidden">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};