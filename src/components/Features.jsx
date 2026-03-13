import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI Respiratory Risk Prediction',
      description: 'Advanced AI algorithms analyze breathing patterns to predict respiratory risks in real-time.'
    },
    {
      icon: '🌬️',
      title: 'Real-time Air Quality Monitoring',
      description: 'Continuous monitoring of environmental air quality and pollutant levels.'
    },
    {
      icon: '💨',
      title: 'Smart Nebulizer Integration',
      description: 'Seamlessly integrates with traditional nebulizers for enhanced functionality.'
    },
    {
      icon: '📋',
      title: 'Doctor-Ready Health Reports',
      description: 'Generate comprehensive health reports for medical professionals.'
    },
    {
      icon: '⚠️',
      title: 'Environmental Trigger Detection',
      description: 'Identify and alert on environmental factors that trigger respiratory issues.'
    },
    {
      icon: '📱',
      title: 'Remote Patient Monitoring',
      description: 'Monitor patients remotely with real-time data and alerts.'
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;