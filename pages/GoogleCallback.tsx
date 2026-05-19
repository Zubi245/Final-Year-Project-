import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('🔵 GoogleCallback mounted');
    console.log('🔵 Full URL:', window.location.href);
    console.log('🔵 Search params:', searchParams.toString());
    
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    console.log('🔵 Token:', token ? 'EXISTS' : 'MISSING');
    console.log('🔵 RefreshToken:', refreshToken ? 'EXISTS' : 'MISSING');
    console.log('🔵 Error:', error);

    if (error) {
      console.error('❌ Google OAuth Error:', error);
      navigate('/auth?error=' + error);
      return;
    }

    if (token && refreshToken) {
      console.log('✅ Tokens found, storing...');
      // Store tokens in localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      console.log('📡 Fetching user data...');
      // Fetch user data from backend
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log('📦 User data received:', data);
          if (data.success && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('✅ User stored in localStorage');
          }
          // Redirect to home
          console.log('🏠 Redirecting to home...');
          navigate('/');
          window.location.reload(); // Reload to update auth state
        })
        .catch(err => {
          console.error('❌ Failed to fetch user:', err);
          navigate('/');
        });
    } else {
      console.error('❌ Tokens missing, redirecting to auth');
      navigate('/auth?error=missing_tokens');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};
