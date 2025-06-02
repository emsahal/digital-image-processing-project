import React from 'react';
import { ArrowDown, Image, FileText, Sliders } from 'lucide-react';

const HeroSection = ({ setShowUpload }) => {
  const handleGetStarted = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
    setShowUpload(true);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fadeIn">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-light-100 to-accent">
              Document Image Processing
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-light-400 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeIn opacity-90">
            Transform your images with powerful filters or extract text effortlessly with our advanced processing engine.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 animate-fadeIn">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
            >
              Start Processing
            </button>
            
            <a
              href="#features"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-dark-700 border border-dark-600 text-light-300 rounded-full hover:bg-dark-600 transition-colors duration-300 w-full md:w-auto"
            >
              Learn More
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-24">
          <FeatureCard 
            icon={<Image className="w-10 h-10 text-primary" />}
            title="Advanced Filters"
            description="Apply professional-grade filters like Gaussian Blur, Edge Detection, and Thresholding to your images."
          />
          <FeatureCard 
            icon={<FileText className="w-10 h-10 text-primary" />}
            title="OCR Technology"
            description="Extract text from images using state-of-the-art OCR technology with high accuracy."
          />
          <FeatureCard 
            icon={<Sliders className="w-10 h-10 text-primary" />}
            title="Fine-Tuned Control"
            description="Adjust every parameter with precision to get exactly the results you need."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:bg-dark-700/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-glass">
    <div className="bg-dark-700 rounded-full w-16 h-16 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-light-100">{title}</h3>
    <p className="text-light-400">{description}</p>
  </div>
);

export default HeroSection;