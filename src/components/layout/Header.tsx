import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, User, Heart, LogIn } from 'lucide-react';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Properti Pro Logo" className="h-10" />
            <span className="font-heading font-bold text-2xl text-accent">
              <span className="text-primary">Properti</span> Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Beranda
            </Link>
            <Link to="/jual" className="font-medium hover:text-primary transition-colors">
              Jual
            </Link>
            <Link to="/sewa" className="font-medium hover:text-primary transition-colors">
              Sewa
            </Link>
            <Link to="/agen" className="font-medium hover:text-primary transition-colors">
              Agen
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/favorit\" className="text-neutral-700 hover:text-primary transition-colors">
                  <Heart size={20} />
                </Link>
                <Link to="/profil" className="flex items-center space-x-2 text-neutral-700 hover:text-primary transition-colors">
                  <User size={20} />
                  <span>Profil</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-neutral-800 hover:text-primary transition-colors">
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary">
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <Home size={20} />
              <span>Beranda</span>
            </Link>
            <Link to="/jual" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Jual</span>
            </Link>
            <Link to="/sewa" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Sewa</span>
            </Link>
            <Link to="/agen" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Agen</span>
            </Link>
            
            <hr className="border-neutral-200" />
            
            {isLoggedIn ? (
              <>
                <Link to="/favorit\" className="flex items-center space-x-2 py-2\" onClick={toggleMenu}>
                  <Heart size={20} />
                  <span>Favorit</span>
                </Link>
                <Link to="/profil" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <User size={20} />
                  <span>Profil</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <LogIn size={20} />
                  <span>Masuk</span>
                </Link>
                <Link to="/register" className="btn-primary text-center" onClick={toggleMenu}>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;