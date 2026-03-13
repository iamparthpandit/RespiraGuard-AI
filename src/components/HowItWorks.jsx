import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: 'Sensors collect respiratory & environmental data',
      description: 'IoT sensors on the nebulizer gather real-time data on breathing patterns and air quality.'
    },
    {
      step: 2,
      title: 'ESP32 sends data to cloud',
      description: 'The microcontroller securely transmits data to Firebase for storage and processing.'
    },
    {
      step: 3,
      title: 'AI model analyzes respiratory patterns',
      description: 'Machine learning algorithms process the data to identify patterns and risks.'
    },
    {
      step: 4,
      title: 'Dashboard provides alerts & doctor reports',
      description: 'Users and doctors receive real-time insights and comprehensive health reports.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;