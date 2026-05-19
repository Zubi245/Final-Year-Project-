import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { login, signup, logout, getCurrentUser } from '../mockService';

export const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const currentUser = getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, isAdminLogin);
      } else {
        await signup(name, email);
      }
      navigate('/admin'); // Redirect to Admin or Dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-emerald-600 font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mb-1">{currentUser.name}</h2>
          <p className="text-gray-500 mb-6">{currentUser.email}</p>
          
          <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm mb-6">
            Role: <span className="font-bold text-emerald-600 capitalize">{currentUser.role}</span>
          </div>

          <div className="space-y-3">
             {currentUser.role === 'admin' && (
                 <button onClick={() => navigate('/admin')} className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                    Go to Admin Panel
                 </button>
             )}
             <button onClick={handleLogout} className="w-full py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50">
               Sign Out
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isLogin ? 'Welcome To TripWise' : 'Create Account'}</h1>
          <p className="text-gray-500">
            {isLogin ? 'Enter your details to access your trips' : 'Join the community of travelers'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Ali Khan"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <input 
               type="password" 
               required 
               value={password}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
               placeholder="••••••••"
             />
          </div>

          {isLogin && (
             <div className="flex items-center gap-2 mt-2">
                 <input 
                    type="checkbox" 
                    id="adminCheck" 
                    checked={isAdminLogin} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsAdminLogin(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                 />
                 <label htmlFor="adminCheck" className="text-sm text-gray-600">Login as Admin (Test mode)</label>
             </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-4 flex justify-center"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('🔵 Redirecting to Google OAuth...');
            window.location.href = 'http://localhost:5000/api/auth/google';
          }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign {isLogin ? 'in' : 'up'} with Google
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setIsAdminLogin(false); }}
            className="text-emerald-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
        
        {isLogin && isAdminLogin && (
            <div className="mt-4 p-2 bg-yellow-50 text-xs text-yellow-800 rounded border border-yellow-200 text-center">
                Hint: Use <strong>admin@tripwise.pk</strong> for admin login.
            </div>
        )}
      </motion.div>
    </div>
  );
};
