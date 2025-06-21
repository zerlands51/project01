import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, error, isAuthenticated, isAdmin, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      navigate(from, { replace: true });
    } else if (isAuthenticated && !isAdmin()) {
      navigate('/admin/unauthorized', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(email, password);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is handled by context
      console.error('Admin login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Admin Login | Properti Pro</title>
        <meta name="description" content="Admin login untuk Properti Pro" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-primary" />
            </div>
            
            <h1 className="font-heading font-bold text-2xl text-accent mb-2">
              Admin Panel
            </h1>
            
            <p className="text-neutral-600">
              Masuk ke panel administrasi Properti Pro
            </p>
          </div>
          
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Login gagal</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Admin
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="admin@propertipro.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk ke Admin Panel'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-xs text-neutral-600 mb-2">Demo Credentials:</p>
              <p className="text-xs text-neutral-700">
                <strong>Admin:</strong> admin@propertipro.id / admin123<br />
                <strong>Super Admin:</strong> superadmin@propertipro.id / admin123
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-primary hover:underline">
              ← Kembali ke Website Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;