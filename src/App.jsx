import React, { useState, useEffect } from 'react';
import { weatherAPI } from './utils/api';
import WeatherCard from './components/WeatherCard';
import WeatherMap from './components/WeatherMap';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ForecastChart from './components/ForecastChart';
import FavoriteCities from './components/FavoriteCities';
import ThemeToggle from './components/ThemeToggle';
import PWAInstall from './components/PWAInstall';
import { FiSun, FiCloud, FiAlertTriangle, FiInfo, FiMap, FiGlobe } from 'react-icons/fi';
import { WiDaySunny, WiCloudy } from 'react-icons/wi';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [favorites, setFavorites] = useState(['Jakarta', 'Bandung', 'Surabaya']);
  const [activeTab, setActiveTab] = useState('weather'); // 'weather' or 'map'
  const [apiStatus, setApiStatus] = useState('active');

  useEffect(() => {
    fetchWeather('Jakarta');
  }, []);

  const fetchWeather = async (city) => {
    setIsLoading(true);
    setError('');
    setActiveTab('weather');
    
    try {
      const [current, forecast] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city)
      ]);
      
      setWeatherData(current);
      setForecastData(forecast);
      setApiStatus('active');
    } catch (err) {
      setError(err.message);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung geolocation');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await weatherAPI.getByCoords(latitude, longitude);
          setWeatherData(data);
          setError('');
          setApiStatus('active');
          setActiveTab('weather');
        } catch (err) {
          setError('Gagal mengambil data lokasi. Coba kota lain.');
          setApiStatus('error');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        if (error.code === 1) {
          setError('Akses lokasi ditolak. Izinkan akses lokasi di browser.');
        } else {
          setError('Gagal mendeteksi lokasi.');
        }
      }
    );
  };

  const toggleUnit = () => setUnit(unit === 'C' ? 'F' : 'C');

  const addToFavorites = () => {
    if (weatherData && !favorites.includes(weatherData.name)) {
      const updatedFavorites = [...favorites, weatherData.name];
      setFavorites(updatedFavorites);
      localStorage.setItem('weather-favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (city) => {
    const updatedFavorites = favorites.filter(fav => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem('weather-favorites', JSON.stringify(updatedFavorites));
  };

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weather-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 
                  dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 
                  p-4 md:p-8 transition-colors duration-300">
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* PWA Install Button */}
      <PWAInstall />

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                apiStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white 
                           flex items-center gap-3">
                <FiSun className="text-yellow-500 animate-pulse" />
                Weather Dashboard
                <FiCloud className="text-blue-400" />
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Real-time weather monitoring with interactive map
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {weatherData && (
              <button
                onClick={addToFavorites}
                disabled={favorites.includes(weatherData.name)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 
                         text-white font-semibold shadow-lg hover:shadow-xl transition-all 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <WiDaySunny />
                {favorites.includes(weatherData.name) ? '✓ Favorit' : '+ Tambah Favorit'}
              </button>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => setUnit('C')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  unit === 'C' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  unit === 'F' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* API Status Banner */}
      <div className={`max-w-7xl mx-auto mb-6 p-4 rounded-xl ${
        apiStatus === 'active' 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <div>
              <h3 className={`font-semibold ${
                apiStatus === 'active' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
              }`}>
                {apiStatus === 'active' ? '✅ API Aktif' : '❌ API Error'}
              </h3>
              <p className={`text-sm ${
                apiStatus === 'active' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              }`}>
                {apiStatus === 'active' 
                  ? 'Menggunakan data real-time dari OpenWeather API' 
                  : error}
              </p>
            </div>
          </div>
          {apiStatus === 'error' && (
            <button
              onClick={() => fetchWeather('Jakarta')}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold 
                       hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        {/* Search Section */}
        <section className="mb-8">
          <SearchBar 
            onSearch={fetchWeather}
            onUseLocation={handleUseLocation}
            isLoading={isLoading}
          />
        </section>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'weather'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <WiCloudy />
            Weather Details
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <FiMap />
            Interactive Map
          </button>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && apiStatus === 'error' && !isLoading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 
                        dark:border-red-800 rounded-2xl p-8 text-center">
            <FiAlertTriangle className="text-5xl text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-3">
              Terjadi Kesalahan
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => fetchWeather('Jakarta')}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 
                         font-semibold transition-colors"
              >
                Coba Jakarta
              </button>
              <button
                onClick={() => setError('')}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                         px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 
                         font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {!isLoading && !error && (
          <>
            {activeTab === 'weather' ? (
              <>
                {/* Current Weather */}
                {weatherData && (
                  <section className="mb-8">
                    <WeatherCard weatherData={weatherData} unit={unit} />
                  </section>
                )}

                {/* Forecast */}
                {forecastData && (
                  <section className="mb-8">
                    <ForecastChart forecastData={forecastData} unit={unit} />
                  </section>
                )}

                {/* Favorites */}
                <section className="mb-8">
                  <FavoriteCities
                    favorites={favorites}
                    onSelect={fetchWeather}
                    onRemove={removeFromFavorites}
                    currentCity={weatherData?.name}
                  />
                </section>
              </>
            ) : (
              /* Map View */
              <section className="mb-8">
                <WeatherMap weatherData={weatherData} favorites={favorites} />
              </section>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 
                      text-white shadow-xl mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <FiInfo />
            Portfolio Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiSun /> UI/UX Features
              </h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Dark/Light Mode Toggle</li>
                <li>• Progressive Web App (PWA)</li>
                <li>• Fully Responsive Design</li>
                <li>• Smooth Animations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiMap /> Interactive Features
              </h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Live Weather Map (Leaflet)</li>
                <li>• City Search & Geolocation</li>
                <li>• Favorites System</li>
                <li>• Unit Conversion (°C/°F)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiGlobe /> Technical Stack
              </h4>
              <ul className="space-y-2 text-blue-100">
                <li>• React 18 + Vite</li>
                <li>• Tailwind CSS</li>
                <li>• OpenWeather API</li>
                <li>• Vercel Deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-300 
                       dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <span className="font-semibold text-gray-800 dark:text-white">
              Weather Dashboard v2.0
            </span> 
            <span className="mx-2">•</span>
            Fresh Grad Portfolio Project
          </p>
          <p className="text-sm">
            API Status: 
            <span className={`font-semibold mx-2 ${
              apiStatus === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {apiStatus === 'active' ? '✅ Active' : '❌ Error'}
            </span>
            {apiStatus === 'active' && weatherData && (
              <>
                <span className="mx-3">•</span>
                Current: <span className="font-semibold">{weatherData.name}</span>
                <span className="mx-1">•</span>
                Temp: <span className="font-semibold">{weatherData.main.temp.toFixed(1)}°C</span>
              </>
            )}
          </p>
          <p className="text-xs mt-4 text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} • Made with ❤️ by [Your Name] • 
            <a 
              href="https://github.com/yourusername/weather-dashboard" 
              className="ml-2 text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;