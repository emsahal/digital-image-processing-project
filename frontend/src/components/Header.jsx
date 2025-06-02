import React, { useState, useEffect } from 'react';
import { Menu, X, ImagePlus, Layers, Info, Github } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleScrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-20 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-800/90 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <ImagePlus className="h-7 w-7 text-primary mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">DIP</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#" icon={<Layers size={18} />} label="Features" />
            <NavLink href="#" icon={<Info size={18} />} label="About" />
            <NavLink href="https://github.com" icon={<Github size={18} />} label="GitHub" />
            
            <button
              onClick={handleScrollToUpload}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <ImagePlus size={18} className="mr-2" />
              <span>Start Processing</span>
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-light-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-700 animate-fadeIn">
          <div className="py-4 px-6 space-y-4">
            <MobileNavLink onClick={() => setIsMobileMenuOpen(false)} icon={<Layers size={18} />} label="Features" />
            <MobileNavLink onClick={() => setIsMobileMenuOpen(false)} icon={<Info size={18} />} label="About" />
            <MobileNavLink onClick={() => setIsMobileMenuOpen(false)} icon={<Github size={18} />} label="GitHub" />
            <button
              onClick={handleScrollToUpload}
              className="w-full mt-4 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <ImagePlus size={18} className="mr-2" />
              <span>Start Processing</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ href, icon, label }) => (
  <a 
    href={href} 
    className="flex items-center text-light-300 hover:text-primary transition-colors duration-300"
  >
    <span className="mr-1">{icon}</span>
    <span>{label}</span>
  </a>
);

const MobileNavLink = ({ onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className="flex items-center w-full text-light-300 hover:text-primary transition-colors duration-300 py-2"
  >
    <span className="mr-3">{icon}</span>
    <span className="text-lg">{label}</span>
  </button>
);

export default Header;