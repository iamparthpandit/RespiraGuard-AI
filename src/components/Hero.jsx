import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-background min-h-screen flex items-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="md:absolute inset-0 w-full h-full object-cover opacity-90 animate-float"
      >
        <source src="/src/assets/lung-animation.mp4" type="video/mp4" />
      </video>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 order-2 md:order-1">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 animate-fade-in">
              Transforming Respiratory Care with AI
            </h1>
            <p className="text-xl text-gray-600 mb-4 animate-fade-in">
              RespiraGuard converts traditional nebulizers into intelligent respiratory monitoring systems using AI and IoT.
            </p>
            <p className="text-lg text-gray-500 mb-8 animate-fade-in">
              Monitor environmental triggers, breathing patterns, and respiratory health in real time with predictive insights and doctor-ready reports.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/dashboard" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-light-blue transition duration-300 text-center">
                Get Started
              </Link>
              <button className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition duration-300">
                View Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 md:invisible">
            {/* Placeholder for desktop layout */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;