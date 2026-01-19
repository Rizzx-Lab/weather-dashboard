import React from 'react';
import { WiDaySunny } from 'react-icons/wi';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 
                      border-blue-500 dark:border-blue-400"></div>
        <WiDaySunny className="absolute top-1/2 left-1/2 transform -translate-x-1/2 
                             -translate-y-1/2 text-4xl text-yellow-500 dark:text-yellow-400 
                             animate-pulse-slow" />
      </div>
      <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg font-medium">
        Loading weather data...
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 animate-pulse">
        Fetching real-time data from OpenWeather
      </p>
      <div className="mt-4 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 
                      animate-progress"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;