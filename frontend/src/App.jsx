import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ImageUpload from './components/ImageUpload';
import Footer from './components/Footer';

function App() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 text-light-100 font-sans">
      <Header />
      <main className="flex-1">
        <HeroSection setShowUpload={setShowUpload} />
        {showUpload && (
          <div className="animate-slideUp">
            <ImageUpload />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;