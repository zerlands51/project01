import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'agent',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { signUp, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.fullName.trim()) {
      errors.push('Nama lengkap harus diisi');
    }

    if (!formData.email.trim()) {
      errors.push('Email harus diisi');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Format email tidak valid');
    }

    if (!formData.password) {
      errors.push('Password harus diisi');
    } else if (formData.password.length < 8) {
      errors.push('Password minimal 8 karakter');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Password dan konfirmasi password tidak cocok');
    }

    if (!formData.agreeTerms) {
      errors.push('Anda harus menyetujui syarat dan ketentuan');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      // Show success message or redirect
      // Navigation will be handled by the useEffect above if auto-confirmed
    } catch (error) {
      // Error is handled by the context
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Daftar | Properti Pro</title>
        <meta name="description" content="Daftar akun Properti Pro untuk akses ke fitur-fitur eksklusif dalam mencari, menjual, atau menyewa properti di Indonesia." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="font-heading font-bold text-2xl text-accent mb-6 text-center">
                Daftar di <span className="text-primary">Properti Pro</span>
              </h1>
              
              {(error || validationErrors.length > 0) && (
                <div className="bg-error-50 border border-error-200 text-error-700 p-3 rounded-md mb-4">
                  <div className="flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Terjadi kesalahan:</p>
                      <ul className="text-sm mt-1 space-y-1">
                        {error && <li>• {error}</li>}
                        {validationErrors.map((err, index) => (
                          <li key={index}>• {err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Masukkan nama lengkap"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Masukkan email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Nomor Telepon <span className="text-neutral-400">(Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Masukkan nomor telepon"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
                    Jenis Akun
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="user">Pengguna (Pencari Properti)</option>
                    <option value="agent">Agen Properti</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Masukkan password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
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
                  <p className="text-xs text-neutral-500 mt-1">
                    Password minimal 8 karakter
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Konfirmasi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      className="h-4 w-4 mt-1 text-primary border-neutral-300 rounded focus:ring-primary"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <label htmlFor="agreeTerms" className="ml-2 block text-sm text-neutral-700">
                      Saya setuju dengan{' '}
                      <Link to="/syarat-ketentuan" className="text-primary hover:underline">
                        Syarat dan Ketentuan
                      </Link>{' '}
                      serta{' '}
                      <Link to="/kebijakan-privasi" className="text-primary hover:underline">
                        Kebijakan Privasi
                      </Link>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Daftar'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-neutral-600">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Masuk
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;