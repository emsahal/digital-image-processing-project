import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="border-t border-dark-600 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-light-500 text-sm mb-4 md:mb-0">
            © 2025 DIP. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-primary transition-colors duration-300">
              <Github size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-primary transition-colors duration-300">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-primary transition-colors duration-300">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;