import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Smart Respiratory Monitoring Today</h2>
        <p className="text-xl text-light-blue mb-8">Join thousands of patients improving their respiratory health with AI-powered insights.</p>
        <Link to="/dashboard" className="bg-white text-primary px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
          Create Account
        </Link>
      </div>
    </section>
  );
};

export default CTA;