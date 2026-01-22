import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiNavigation } from 'react-icons/fi';

const SearchBar = ({ onSearch, onUseLocation, isLoading }) => {
  const [city, setCity] = useState('');
  
  const popularCities = ['Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Yogyakarta'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleUseLocation = () => {
    setCity(''); // Clear input saat gunakan lokasi
    onUseLocation();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cari kota di Indonesia (contoh: Jakarta, Bandung)..."
            className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                     outline-none transition-all text-gray-800 bg-white shadow-sm"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !city.trim()}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold
                       hover:bg-blue-600 transition-colors shadow-md
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mencari...' : 'Cari'}
            </button>
          </div>
        </div>
      </form>

      {/* Use My Location Button - Prominent placement */}
      <button
        onClick={handleUseLocation}
        disabled={isLoading}
        className="w-full mb-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 
                 text-white font-semibold hover:from-blue-600 hover:to-blue-700 
                 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                 flex items-center justify-center gap-3"
      >
        <FiNavigation className="text-xl" />
        <span>📍 Gunakan Lokasi Saya</span>
      </button>

      {/* Popular cities */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-gray-600 text-sm">Kota populer:</span>
        {popularCities.map((popularCity, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCity(popularCity);
              onSearch(popularCity);
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 
                     text-blue-700 text-sm hover:bg-blue-200 transition-colors 
                     disabled:opacity-50"
          >
            <FiMapPin />
            {popularCity}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;