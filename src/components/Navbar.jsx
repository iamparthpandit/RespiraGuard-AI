import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">RespiraGuard</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary">Home</a>
            <a href="#features" className="text-gray-700 hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary">How It Works</a>
            <a href="#doctors" className="text-gray-700 hover:text-primary">Doctors</a>
            <a href="#contact" className="text-gray-700 hover:text-primary">Contact</a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-primary">Login</button>
            <Link to="/auth" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-light-blue">Get Started</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-primary">Home</a>
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-primary">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-primary">How It Works</a>
            <a href="#doctors" className="block px-3 py-2 text-gray-700 hover:text-primary">Doctors</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary">Contact</a>
            <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary">Login</button>
            <Link to="/auth" className="block w-full bg-primary text-white px-3 py-2 rounded-md hover:bg-light-blue text-center">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;