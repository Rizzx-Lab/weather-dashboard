import React from 'react';
import { FiStar, FiMapPin, FiTrash2, FiChevronRight } from 'react-icons/fi';

const FavoriteCities = ({ favorites, onSelect, onRemove, currentCity }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiStar className="text-yellow-500 text-2xl" />
          <h3 className="text-2xl font-bold text-gray-800">Kota Favorit</h3>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          {favorites.length} kota
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((city, idx) => (
          <div
            key={idx}
            className={`relative rounded-xl border-2 p-4 transition-all group ${
              currentCity === city
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiMapPin className={`text-xl ${
                  currentCity === city ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <div>
                  <h4 className="font-semibold text-gray-800">{city}</h4>
                  <p className="text-sm text-gray-500">
                    {currentCity === city ? 'Sedang dilihat' : 'Klik untuk melihat'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove(city)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 
                           hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Hapus dari favorit"
                >
                  <FiTrash2 className="text-gray-400 hover:text-red-500" />
                </button>
                <FiChevronRight className="text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={() => onSelect(city)}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteCities;