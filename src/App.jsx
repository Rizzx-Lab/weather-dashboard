import React, { useState, useEffect } from 'react';
import { weatherAPI } from './utils/api';
import AdvancedWeatherCard from './components/AdvancedWeatherCard';
import WeatherMap from './components/WeatherMap';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ForecastChart from './components/ForecastChart';
import FavoriteCities from './components/FavoriteCities';
import ThemeToggle from './components/ThemeToggle';
import PWAInstall from './components/PWAInstall';
import WeatherAnalytics from './components/WeatherAnalytics';
import { FiSun, FiCloud, FiAlertTriangle, FiInfo, FiMap, FiGlobe, FiPhone, FiMail, FiGithub } from 'react-icons/fi';
import { WiDaySunny, WiCloudy } from 'react-icons/wi';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [favorites, setFavorites] = useState([]); // 👈 KOSONG, tidak ada default Jakarta/Bandung/Surabaya
  const [activeTab, setActiveTab] = useState('weather');
  const [apiStatus, setApiStatus] = useState('active');
  const [locationDetected, setLocationDetected] = useState(false);

  // Load favorites dari localStorage saat pertama kali
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weather-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // AUTO-DETECT LOCATION saat pertama kali load
  useEffect(() => {
    const initializeWeather = async () => {
      // Cek apakah browser support geolocation
      if (!navigator.geolocation) {
        console.log('Browser tidak support geolocation, menggunakan Jakarta sebagai default');
        fetchWeather('Jakarta');
        return;
      }

      setIsLoading(true);

      // Coba auto-detect lokasi user
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('📍 Lokasi terdeteksi:', latitude, longitude);
            
            // Fetch weather berdasarkan koordinat
            const [current, forecast] = await Promise.all([
              weatherAPI.getByCoords(latitude, longitude),
              weatherAPI.getForecast(`${latitude},${longitude}`)
            ]);
            
            setWeatherData(current);
            setForecastData(forecast);
            setLocationDetected(true);
            setApiStatus('active');
            setError('');
            
            // 👇 AUTO-ADD kota device ke favorites jika belum ada
            const cityName = current.name;
            const savedFavorites = localStorage.getItem('weather-favorites');
            const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
            
            if (!currentFavorites.includes(cityName)) {
              const updatedFavorites = [cityName, ...currentFavorites]; // Taruh di paling depan
              setFavorites(updatedFavorites);
              localStorage.setItem('weather-favorites', JSON.stringify(updatedFavorites));
              console.log(`✅ "${cityName}" ditambahkan ke favorites`);
            }
            
            console.log('✅ Weather data loaded dari lokasi kamu:', current.name);
          } catch (err) {
            console.error('❌ Error fetching weather by coords:', err);
            // Fallback ke Jakarta jika gagal
            fetchWeather('Jakarta');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          // User tolak permission atau error lainnya
          console.log('⚠️ Geolocation error:', error.message);
          
          if (error.code === 1) {
            console.log('User menolak akses lokasi, menggunakan Jakarta sebagai default');
          } else {
            console.log('Gagal mendeteksi lokasi, menggunakan Jakarta sebagai default');
          }
          
          // Fallback ke Jakarta
          fetchWeather('Jakarta');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    initializeWeather();
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
      setLocationDetected(false);
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
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Fetch current weather dan forecast
          const [current, forecast] = await Promise.all([
            weatherAPI.getByCoords(latitude, longitude),
            weatherAPI.getForecast(`${latitude},${longitude}`)
          ]);
          
          setWeatherData(current);
          setForecastData(forecast);
          setLocationDetected(true);
          setApiStatus('active');
          setActiveTab('weather');
          setError('');

          // 👇 AUTO-ADD kota ke favorites jika belum ada (saat manual click)
          const cityName = current.name;
          if (!favorites.includes(cityName)) {
            const updatedFavorites = [cityName, ...favorites];
            setFavorites(updatedFavorites);
            localStorage.setItem('weather-favorites', JSON.stringify(updatedFavorites));
            console.log(`✅ "${cityName}" ditambahkan ke favorites`);
          }
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
        } else if (error.code === 2) {
          setError('Lokasi tidak tersedia. Periksa koneksi GPS/internet.');
        } else if (error.code === 3) {
          setError('Timeout mendeteksi lokasi. Coba lagi.');
        } else {
          setError('Gagal mendeteksi lokasi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 
                  dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 
                  p-4 md:p-8 transition-colors duration-300">
      
      <ThemeToggle />
      <PWAInstall />

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
              {locationDetected && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                  📍 Auto-detected your location
                </span>
              )}
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

      <main className="max-w-7xl mx-auto">
        <section className="mb-8">
          <SearchBar 
            onSearch={fetchWeather}
            onUseLocation={handleUseLocation}
            isLoading={isLoading}
          />
        </section>

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

        {isLoading && <LoadingSpinner />}

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
                onClick={handleUseLocation}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 
                         font-semibold transition-colors flex items-center gap-2"
              >
                📍 Gunakan Lokasi Saya
              </button>
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

        {!isLoading && !error && (
          <>
            {activeTab === 'weather' ? (
              <>
                {weatherData && (
                  <section className="mb-8">
                    <AdvancedWeatherCard weatherData={weatherData} unit={unit} />
                  </section>
                )}

                {forecastData && (
                  <section className="mb-8">
                    <ForecastChart forecastData={forecastData} unit={unit} />
                  </section>
                )}

                {forecastData && (
                  <section className="mb-8">
                    <WeatherAnalytics forecast={forecastData} />
                  </section>
                )}

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
              <section className="mb-8">
                <WeatherMap weatherData={weatherData} favorites={favorites} />
              </section>
            )}
          </>
        )}

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
                <li>• Advanced Weather Card</li>
                <li>• Weather Analytics Charts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiMap /> Interactive Features
              </h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Live Weather Map (Leaflet)</li>
                <li>• Auto Location Detection 📍</li>
                <li>• Auto-Add Device City to Favorites</li>
                <li>• City Search & Manual Geolocation</li>
                <li>• Favorites System</li>
                <li>• Unit Conversion (°C/°F)</li>
                <li>• Real-time Data Visualization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiGlobe /> Technical Stack
              </h4>
              <ul className="space-y-2 text-blue-100">
                <li>• React 18 + Vite</li>
                <li>• Tailwind CSS</li>
                <li>• Recharts + Framer Motion</li>
                <li>• React Spring Animations</li>
                <li>• OpenWeather API</li>
                <li>• Vercel Deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-300 
                       dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              Weather Dashboard v2.0
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Fresh Grad Portfolio Project - Real-time weather monitoring with interactive features
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className={`font-semibold ${
                apiStatus === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                API Status: {apiStatus === 'active' ? 'Active' : 'Error'}
              </span>
              {apiStatus === 'active' && weatherData && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {weatherData.name} • {weatherData.main.temp.toFixed(1)}°C
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Contact Me
            </h4>
            <div className="space-y-2">
              <a 
                href="tel:+6281027099361"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 
                         hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <FiPhone className="text-lg" />
                <span>0881-0270-99361</span>
              </a>
              <a 
                href="mailto:muhammadfarizsetiawan1604@gmail.com"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 
                         hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <FiMail className="text-lg" />
                <span>muhammadfarizsetiawan1604@gmail.com</span>
              </a>
              <a 
                href="https://github.com/Rizzx-Lab/weather-dashboard" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 
                         hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <FiGithub className="text-lg" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} • Made with ❤️ by 
            <span className="font-semibold text-gray-800 dark:text-white mx-1">
              Muhammad Fariz Setiawan
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;