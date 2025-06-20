import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setTokenValid(false);
      return;
    }

    // Simulate token validation
    setTimeout(() => {
      // In a real app, you'd validate the token with your backend
      setTokenValid(true);
    }, 1000);
  }, [token]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf besar');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password harus mengandung huruf kecil');
    }
    if (!/\d/.test(password)) {
      errors.push('Password harus mengandung angka');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <Layout>
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-neutral-600">Memvalidasi link reset password...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <Layout>
        <Helmet>
          <title>Link Tidak Valid | Properti Pro</title>
          <meta name="description" content="Link reset password tidak valid atau telah kedaluwarsa." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-error-500" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-4">
                  Link Tidak Valid
                </h1>
                
                <p className="text-neutral-600 mb-6">
                  Link reset password tidak valid atau telah kedaluwarsa. Silakan minta link reset password yang baru.
                </p>
                
                <div className="space-y-3">
                  <Link to="/forgot-password" className="w-full btn-primary">
                    Minta Link Baru
                  </Link>
                  
                  <Link to="/login" className="w-full btn-secondary">
                    Kembali ke Halaman Masuk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Layout>
        <Helmet>
          <title>Password Berhasil Direset | Properti Pro</title>
          <meta name="description" content="Password Anda berhasil direset. Silakan masuk dengan password baru." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-success-500" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-4">
                  Password Berhasil Direset!
                </h1>
                
                <p className="text-neutral-600 mb-6">
                  Password Anda telah berhasil direset. Anda akan dialihkan ke halaman masuk dalam beberapa detik.
                </p>
                
                <Link to="/login" className="w-full btn-primary">
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Reset Password | Properti Pro</title>
        <meta name="description" content="Buat password baru untuk akun Properti Pro Anda." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-primary" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-2">
                  Reset Password
                </h1>
                
                <p className="text-neutral-600">
                  Masukkan password baru untuk akun Anda
                </p>
              </div>
              
              {error && (
                <div className="bg-error-50 text-error-700 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Masukkan password baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
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
                  <div className="mt-2 text-xs text-neutral-500">
                    <p>Password harus mengandung:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Minimal 8 karakter</li>
                      <li>Huruf besar dan kecil</li>
                      <li>Minimal 1 angka</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Konfirmasi password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
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
                
                <button
                  type="submit"
                  className="w-full btn-primary py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Reset Password'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link to="/login" className="text-primary hover:underline">
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;