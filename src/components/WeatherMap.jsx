// src/components/WeatherMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiNavigation, FiZoomIn, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { weatherAPI } from '../utils/api';

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
  const [majorCities, setMajorCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState('ID');
  const [currentCountryName, setCurrentCountryName] = useState('Indonesia');
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Country names mapping
  const getCountryName = (code) => {
    const countries = {
      'ID': 'Indonesia', 'US': 'United States', 'GB': 'United Kingdom', 
      'JP': 'Japan', 'AU': 'Australia', 'FR': 'France', 'DE': 'Germany',
      'CN': 'China', 'IN': 'India', 'SG': 'Singapore', 'MY': 'Malaysia',
      'TH': 'Thailand', 'PH': 'Philippines', 'KR': 'South Korea', 'VN': 'Vietnam',
      'CA': 'Canada', 'BR': 'Brazil', 'MX': 'Mexico', 'IT': 'Italy', 
      'ES': 'Spain', 'NL': 'Netherlands', 'BE': 'Belgium', 'CH': 'Switzerland',
      'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
      'FI': 'Finland', 'PL': 'Poland', 'RU': 'Russia', 'TR': 'Turkey',
      'SA': 'Saudi Arabia', 'AE': 'UAE', 'EG': 'Egypt', 'ZA': 'South Africa',
      'NG': 'Nigeria', 'AR': 'Argentina', 'CL': 'Chile', 'PE': 'Peru',
      'CO': 'Colombia', 'NZ': 'New Zealand', 'PT': 'Portugal', 'GR': 'Greece',
      'CZ': 'Czech Republic', 'HU': 'Hungary', 'RO': 'Romania', 'UA': 'Ukraine',
      'IL': 'Israel', 'PK': 'Pakistan', 'BD': 'Bangladesh', 'LK': 'Sri Lanka',
      'MM': 'Myanmar', 'KH': 'Cambodia', 'LA': 'Laos', 'NP': 'Nepal', 'IE': 'Ireland',
    };
    return countries[code] || code;
  };

  // Function untuk auto-detect dan load major cities
  const autoDetectAndLoadCities = async (countryCode, lat, lon) => {
    setIsLoadingCities(true);
    setLoadingProgress(0);
    setErrorMessage(null);

    try {
      // Step 1: Get major cities (20%)
      setLoadingProgress(20);
      const cities = await weatherAPI.getMajorCitiesByCountry(countryCode, 10);
      
      if (!cities || cities.length === 0) {
        // Fallback: get nearby cities
        setLoadingProgress(40);
        const nearbyCities = await weatherAPI.getNearbyMajorCities(lat, lon, countryCode);
        
        if (nearbyCities && nearbyCities.length > 0) {
          // Step 2: Fetch weather data (60%)
          setLoadingProgress(60);
          const citiesWithWeather = await weatherAPI.getWeatherForCities(nearbyCities);
          
          // Step 3: Set cities (100%)
          setLoadingProgress(100);
          setMajorCities(citiesWithWeather);
          setCurrentCountry(countryCode);
          setCurrentCountryName(getCountryName(countryCode));
        } else {
          setErrorMessage('No major cities found in this region');
          setMajorCities([]);
        }
      } else {
        // Step 2: Fetch weather data
        setLoadingProgress(60);
        const citiesWithWeather = await weatherAPI.getWeatherForCities(cities);
        
        // Step 3: Set cities
        setLoadingProgress(100);
        setMajorCities(citiesWithWeather);
        setCurrentCountry(countryCode);
        setCurrentCountryName(getCountryName(countryCode));
      }
    } catch (error) {
      console.error('Error auto-detecting cities:', error);
      setErrorMessage('Failed to load major cities for this region');
      setMajorCities([]);
    } finally {
      setIsLoadingCities(false);
      setTimeout(() => setLoadingProgress(0), 500);
    }
  };

  // Detect country dan load cities ketika weatherData berubah
  useEffect(() => {
    const detectAndLoad = async () => {
      if (weatherData?.coord) {
        const { lat, lon } = weatherData.coord;
        setMapCenter([lat, lon]);
        setMapZoom(10);
        
        // Set selected city
        setSelectedCity({
          name: weatherData.name,
          lat,
          lon,
          temp: weatherData.main.temp,
          condition: weatherData.weather[0].main,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
          feelsLike: weatherData.main.feels_like,
          pressure: weatherData.main.pressure
        });

        // Get country code
        let countryCode = weatherData.sys?.country;
        
        // Jika country code tidak ada, gunakan reverse geocoding
        if (!countryCode) {
          const locationInfo = await weatherAPI.reverseGeocode(lat, lon);
          if (locationInfo && locationInfo.country) {
            countryCode = locationInfo.country;
          }
        }

        // Auto-detect dan load cities untuk country ini
        if (countryCode && countryCode !== currentCountry) {
          await autoDetectAndLoadCities(countryCode, lat, lon);
        }
      }
    };

    detectAndLoad();
  }, [weatherData]);

  // Initial load
  useEffect(() => {
    // Load default Indonesia cities on mount
    autoDetectAndLoadCities('ID', -6.2146, 106.8451);
  }, []);

  const getConditionColor = (condition) => {
    const colors = {
      'Clear': '#F59E0B',
      'Clouds': '#6B7280',
      'Rain': '#0EA5E9',
      'Thunderstorm': '#8B5CF6',
      'Snow': '#93C5FD',
      'Mist': '#A5B4FC',
      'Drizzle': '#60A5FA',
      'Haze': '#D1D5DB',
      'Fog': '#9CA3AF',
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
      'Drizzle': '🌦️',
      'Haze': '🌁',
      'Fog': '🌫️',
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
            {isLoadingCities && (
              <span className="text-sm font-normal text-gray-500">
                (Auto-detecting cities...)
              </span>
            )}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {isLoadingCities ? (
              <span className="flex items-center gap-2">
                <FiLoader className="animate-spin" />
                Searching major cities in {currentCountryName}...
              </span>
            ) : (
              `Showing weather across ${currentCountryName}`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Others</span>
          </div>
        </div>
      </div>

      {/* Loading Progress Bar */}
      {isLoadingCities && loadingProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {loadingProgress < 40 ? 'Finding cities...' : 
             loadingProgress < 80 ? 'Getting weather data...' : 
             'Almost done...'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 
                      dark:border-yellow-800 rounded-lg flex items-center gap-2">
          <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{errorMessage}</p>
        </div>
      )}

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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
                    <div className="p-2 min-w-[150px]">
                      <h4 className="font-bold text-lg mb-2">{selectedCity.name}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                          🌡️ {selectedCity.temp?.toFixed(1)}°C
                        </p>
                        <p className="text-gray-600">
                          {getConditionIcon(selectedCity.condition)} {selectedCity.condition}
                        </p>
                        {selectedCity.humidity && (
                          <p className="text-gray-600">
                            💧 Humidity: {selectedCity.humidity}%
                          </p>
                        )}
                        {selectedCity.windSpeed && (
                          <p className="text-gray-600">
                            💨 Wind: {selectedCity.windSpeed.toFixed(1)} m/s
                          </p>
                        )}
                      </div>
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
            {majorCities
              .filter(city => !selectedCity || city.name !== selectedCity.name)
              .map((city, idx) => (
                <Marker
                  key={idx}
                  position={[city.lat, city.lon]}
                  icon={createCustomIcon(getConditionColor(city.condition))}
                  eventHandlers={{
                    click: () => handleCityClick(city),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold">{city.name}</h4>
                      {city.temp !== null && (
                        <>
                          <p>🌡️ {city.temp.toFixed(1)}°C</p>
                          <p>{getConditionIcon(city.condition)} {city.condition}</p>
                          {city.humidity && <p>💧 {city.humidity}%</p>}
                        </>
                      )}
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
              📍 {selectedCity?.name || 'Select a city'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentCountryName} ({currentCountry})
            </p>
          </div>
        </div>

        {/* Cities List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FiNavigation className="text-blue-500" />
              Major Cities
              {majorCities.length > 0 && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 
                               dark:text-blue-400 px-2 py-1 rounded-full">
                  {majorCities.length}
                </span>
              )}
            </h4>
            {isLoadingCities && (
              <FiLoader className="animate-spin text-blue-500" />
            )}
          </div>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {majorCities.length === 0 && !isLoadingCities ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <FiAlertCircle className="mx-auto mb-2 text-2xl" />
                <p className="text-sm">No cities found</p>
                <p className="text-xs mt-1">Try searching a different location</p>
              </div>
            ) : (
              majorCities.map((city, idx) => (
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
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 dark:text-white">
                        {city.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        {city.condition && (
                          <span className="text-gray-600 dark:text-gray-300 text-sm">
                            {getConditionIcon(city.condition)} {city.condition}
                          </span>
                        )}
                      </div>
                      {city.state && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {city.state}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {city.temp !== null && city.temp !== undefined ? (
                        <>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {city.temp.toFixed(1)}°C
                          </p>
                          {city.humidity && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              💧 {city.humidity}%
                            </p>
                          )}
                        </>
                      ) : (
                        <FiLoader className="animate-spin text-gray-400" />
                      )}
                    </div>
                  </div>
                  {selectedCity?.name === city.name && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 dark:text-blue-400">
                          ✓ Currently viewing
                        </span>
                        <FiZoomIn className="text-blue-500" />
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 
                        dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">🤖 Auto-Magic:</span> Cities are automatically detected based on your search location's country and region!
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Weather Conditions
        </h5>
        <div className="flex flex-wrap gap-4">
          {['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Snow', 'Mist'].map((condition) => (
            <div key={condition} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getConditionColor(condition) }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getConditionIcon(condition)} {condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;