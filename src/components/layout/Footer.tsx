import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-accent text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">
              <span className="text-primary">Properti</span> Pro
            </h3>
            <p className="mb-4 text-neutral-300">
              Platform jual beli dan sewa properti terpercaya di Indonesia dengan beragam pilihan properti berkualitas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Properti</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <Link to="/jual/rumah" className="hover:text-primary transition-colors">Rumah Dijual</Link>
              </li>
              <li>
                <Link to="/sewa/rumah" className="hover:text-primary transition-colors">Rumah Disewa</Link>
              </li>
              <li>
                <Link to="/jual/apartemen" className="hover:text-primary transition-colors">Apartemen Dijual</Link>
              </li>
              <li>
                <Link to="/sewa/apartemen" className="hover:text-primary transition-colors">Apartemen Disewa</Link>
              </li>
              <li>
                <Link to="/jual/tanah" className="hover:text-primary transition-colors">Tanah Dijual</Link>
              </li>
              <li>
                <Link to="/jual/ruko" className="hover:text-primary transition-colors">Ruko Dijual</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <Link to="/tentang-kami" className="hover:text-primary transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/karir" className="hover:text-primary transition-colors">Karir</Link>
              </li>
              <li>
                <Link to="/hubungi-kami" className="hover:text-primary transition-colors">Hubungi Kami</Link>
              </li>
              <li>
                <Link to="/kebijakan-privasi" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
              </li>
              <li>
                <Link to="/syarat-ketentuan" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Kontak</h4>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10270</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0" />
                <span>info@propertipro.id</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-neutral-700 my-6" />

        <div className="text-center text-neutral-400 text-sm">
          &copy; {new Date().getFullYear()} Properti Pro. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;