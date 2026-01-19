import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiNavigation, FiZoomIn } from 'react-icons/fi';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon function
const createCustomIcon = (color = '#3B82F6') => {
  return new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="color: white; width: 12px; height: 12px;" 
             fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6c0 4.14 6 10 6 10s6-5.86 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: 'custom-marker'
  });
};

// Map controller component
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

// Recenter button
const RecenterButton = ({ center }) => {
  const map = useMap();

  const handleClick = () => {
    map.setView(center, map.getZoom());
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 z-[1000] p-2 bg-white dark:bg-dark-card 
               rounded-lg shadow-lg hover:shadow-xl transition-all border 
               border-gray-200 dark:border-dark-border"
      title="Recenter map"
    >
      <FiNavigation className="text-gray-700 dark:text-gray-300" />
    </button>
  );
};

const WeatherMap = ({ weatherData, favorites = [] }) => {
  const [mapCenter, setMapCenter] = useState([-6.2146, 106.8451]); // Jakarta default
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedCity, setSelectedCity] = useState(null);

  // Default Indonesian cities
  const defaultCities = [
    { name: 'Jakarta', lat: -6.2146, lon: 106.8451, temp: 32, condition: 'Clouds' },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191, temp: 24, condition: 'Clouds' },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521, temp: 33, condition: 'Clear' },
    { name: 'Bali', lat: -8.4095, lon: 115.1889, temp: 28, condition: 'Rain' },
    { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695, temp: 27, condition: 'Clouds' },
    { name: 'Medan', lat: 3.5952, lon: 98.6722, temp: 30, condition: 'Clear' },
    { name: 'Makassar', lat: -5.1477, lon: 119.4327, temp: 31, condition: 'Clear' },
    { name: 'Semarang', lat: -6.9667, lon: 110.4167, temp: 29, condition: 'Clouds' },
  ];

  useEffect(() => {
    if (weatherData?.coord) {
      const { lat, lon } = weatherData.coord;
      setMapCenter([lat, lon]);
      setMapZoom(10);
      setSelectedCity({
        name: weatherData.name,
        lat,
        lon,
        temp: weatherData.main.temp,
        condition: weatherData.weather[0].main
      });
    }
  }, [weatherData]);

  const getConditionColor = (condition) => {
    const colors = {
      'Clear': '#F59E0B',     // Yellow
      'Clouds': '#6B7280',    // Gray
      'Rain': '#0EA5E9',      // Blue
      'Thunderstorm': '#8B5CF6', // Purple
      'Snow': '#93C5FD',      // Light Blue
      'Mist': '#A5B4FC',      // Indigo
    };
    return colors[condition] || '#3B82F6';
  };

  const getConditionIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
    };
    return icons[condition] || '🌤️';
  };

  const handleCityClick = (city) => {
    setMapCenter([city.lat, city.lon]);
    setMapZoom(12);
    setSelectedCity(city);
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiMapPin className="text-blue-500" />
            Weather Map
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive map with weather locations across Indonesia
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Other Cities</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 h-[400px] relative rounded-xl overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="h-full w-full rounded-xl"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Current weather location */}
            {selectedCity && (
              <>
                <Marker
                  position={[selectedCity.lat, selectedCity.lon]}
                  icon={createCustomIcon('#3B82F6')}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-lg">{selectedCity.name}</h4>
                      <p className="text-gray-600">
                        Temp: {selectedCity.temp.toFixed(1)}°C
                      </p>
                      <p className="text-gray-600">
                        Condition: {selectedCity.condition}
                      </p>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={[selectedCity.lat, selectedCity.lon]}
                  radius={5000}
                  pathOptions={{ 
                    fillColor: '#3B82F6', 
                    color: '#3B82F6',
                    fillOpacity: 0.1,
                    weight: 1
                  }}
                />
              </>
            )}
            
            {/* Other cities */}
            {defaultCities
              .filter(city => !selectedCity || city.name !== selectedCity.name)
              .map((city, idx) => (
                <Marker
                  key={idx}
                  position={[city.lat, city.lon]}
                  icon={createCustomIcon('#6B7280')}
                  eventHandlers={{
                    click: () => handleCityClick(city),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold">{city.name}</h4>
                      <p>Temp: {city.temp}°C</p>
                      <p>Condition: {city.condition}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            
            <MapController center={mapCenter} zoom={mapZoom} />
            <RecenterButton center={mapCenter} />
          </MapContainer>
          
          <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-dark-card 
                        px-3 py-2 rounded-lg shadow-lg border border-gray-200 
                        dark:border-dark-border">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {selectedCity?.name || 'Select a city'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click markers for details
            </p>
          </div>
        </div>

        {/* Cities List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FiNavigation className="text-blue-500" />
            Major Cities
          </h4>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {defaultCities.map((city, idx) => (
              <button
                key={idx}
                onClick={() => handleCityClick(city)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedCity?.name === city.name
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-white">
                      {city.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {getConditionIcon(city.condition)} {city.condition}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {city.temp}°C
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                    </p>
                  </div>
                </div>
                {selectedCity?.name === city.name && (
                  <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400">
                        Currently selected
                      </span>
                      <FiZoomIn className="text-blue-500" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 
                        dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Tip:</span> Click any city to center the map and view weather details.
              Zoom with scroll wheel or buttons.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Weather Legend
        </h5>
        <div className="flex flex-wrap gap-4">
          {['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Snow'].map((condition) => (
            <div key={condition} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getConditionColor(condition) }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;