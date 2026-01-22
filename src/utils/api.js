// src/utils/api.js
import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '02895eb1363efdd13b1ab2ffb695d75b';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// GeoDB Cities API - GRATIS, tidak perlu API key untuk basic usage
const GEODB_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'SIGN-UP-FOR-KEY'; // Optional, bisa tanpa key dengan limit lebih rendah

export const weatherAPI = {
  // Get current weather by city name
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Kota "${city}" tidak ditemukan. Coba cek ejaan.`);
      } else if (error.response?.status === 401) {
        throw new Error('API Key tidak valid. Periksa konfigurasi.');
      } else if (error.response?.status === 429) {
        throw new Error('Terlalu banyak request. Coba lagi nanti.');
      } else {
        throw new Error(error.response?.data?.message || 'Gagal memuat data cuaca');
      }
    }
  },

  // Get forecast
  getForecast: async (city) => {
    try {
      if (typeof city === 'string' && city.includes(',')) {
        const [lat, lon] = city.split(',');
        return await weatherAPI.getForecastByCoords(parseFloat(lat), parseFloat(lon));
      }

      const response = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Prakiraan cuaca tidak tersedia untuk kota ini');
    }
  },

  // Get weather by coordinates
  getByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Tidak dapat mengambil data cuaca untuk lokasi ini');
    }
  },

  // Get forecast by coordinates
  getForecastByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Tidak dapat mengambil prakiraan cuaca untuk lokasi ini');
    }
  },

  // Reverse Geocoding - Dapatkan country code dari koordinat
  reverseGeocode: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
      );
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          name: location.name,
          country: location.country,
          state: location.state,
          lat: location.lat,
          lon: location.lon
        };
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  },

  // OTOMATIS: Dapatkan major cities berdasarkan country code
  // Menggunakan OpenWeatherMap Geocoding API dengan pattern search
  getMajorCitiesByCountry: async (countryCode, limit = 10) => {
    try {
      // Strategi 1: Gunakan capital cities yang umum dikenal per region
      const capitalCities = await weatherAPI.getCapitalAndMajorCities(countryCode);
      
      if (capitalCities && capitalCities.length > 0) {
        return capitalCities.slice(0, limit);
      }

      // Fallback: Return empty array jika tidak ada
      return [];
    } catch (error) {
      console.error('Error getting major cities:', error);
      return [];
    }
  },

  // Helper: Dapatkan kota-kota dari nearby search
  getCapitalAndMajorCities: async (countryCode) => {
    try {
      // Database minimal capital cities untuk fallback
      const knownCapitals = {
        'ID': 'Jakarta', 'US': 'Washington', 'GB': 'London', 'JP': 'Tokyo',
        'AU': 'Canberra', 'FR': 'Paris', 'DE': 'Berlin', 'CN': 'Beijing',
        'IN': 'New Delhi', 'SG': 'Singapore', 'MY': 'Kuala Lumpur', 'TH': 'Bangkok',
        'PH': 'Manila', 'KR': 'Seoul', 'VN': 'Hanoi', 'CA': 'Ottawa',
        'BR': 'Brasilia', 'MX': 'Mexico City', 'IT': 'Rome', 'ES': 'Madrid',
        'NL': 'Amsterdam', 'BE': 'Brussels', 'CH': 'Bern', 'AT': 'Vienna',
        'SE': 'Stockholm', 'NO': 'Oslo', 'DK': 'Copenhagen', 'FI': 'Helsinki',
        'PL': 'Warsaw', 'RU': 'Moscow', 'TR': 'Ankara', 'SA': 'Riyadh',
        'AE': 'Abu Dhabi', 'EG': 'Cairo', 'ZA': 'Pretoria', 'NG': 'Abuja',
        'AR': 'Buenos Aires', 'CL': 'Santiago', 'PE': 'Lima', 'CO': 'Bogota',
        'NZ': 'Wellington', 'PT': 'Lisbon', 'GR': 'Athens', 'CZ': 'Prague',
        'HU': 'Budapest', 'RO': 'Bucharest', 'UA': 'Kyiv', 'IL': 'Jerusalem',
        'PK': 'Islamabad', 'BD': 'Dhaka', 'LK': 'Colombo', 'MM': 'Naypyidaw',
        'KH': 'Phnom Penh', 'LA': 'Vientiane', 'NP': 'Kathmandu', 'IE': 'Dublin',
      };

      const capitalCity = knownCapitals[countryCode];
      if (!capitalCity) {
        return [];
      }

      // Cari kota dengan pattern search menggunakan country code
      const response = await axios.get(
        `${GEO_URL}/direct?q=${capitalCity},${countryCode}&limit=1&appid=${WEATHER_API_KEY}`
      );

      if (response.data && response.data.length > 0) {
        const capital = response.data[0];
        
        // Dapatkan kota-kota nearby
        const nearbyCities = await weatherAPI.getNearbyMajorCities(
          capital.lat, 
          capital.lon, 
          countryCode
        );

        return nearbyCities;
      }

      return [];
    } catch (error) {
      console.error('Error getting capital cities:', error);
      return [];
    }
  },

  // Dapatkan kota-kota besar di sekitar koordinat tertentu
  getNearbyMajorCities: async (lat, lon, countryCode, radius = 1000) => {
    try {
      // Menggunakan grid search untuk menemukan kota-kota nearby
      const cities = new Set();
      const cityList = [];

      // Search pattern: north, south, east, west, dan diagonal
      const offsets = [
        { lat: 0, lon: 0 },      // center
        { lat: 3, lon: 0 },      // north
        { lat: -3, lon: 0 },     // south
        { lat: 0, lon: 3 },      // east
        { lat: 0, lon: -3 },     // west
        { lat: 2, lon: 2 },      // northeast
        { lat: 2, lon: -2 },     // northwest
        { lat: -2, lon: 2 },     // southeast
        { lat: -2, lon: -2 },    // southwest
      ];

      for (const offset of offsets) {
        const searchLat = lat + offset.lat;
        const searchLon = lon + offset.lon;

        try {
          const response = await axios.get(
            `${GEO_URL}/reverse?lat=${searchLat}&lon=${searchLon}&limit=5&appid=${WEATHER_API_KEY}`
          );

          if (response.data) {
            response.data.forEach(location => {
              if (location.country === countryCode && !cities.has(location.name)) {
                cities.add(location.name);
                cityList.push({
                  name: location.name,
                  lat: location.lat,
                  lon: location.lon,
                  country: location.country,
                  state: location.state
                });
              }
            });
          }
        } catch (err) {
          // Skip error untuk individual searches
          continue;
        }

        // Batasi max 10 kota untuk performa
        if (cityList.length >= 10) break;
      }

      return cityList.slice(0, 10);
    } catch (error) {
      console.error('Error getting nearby cities:', error);
      return [];
    }
  },

  // Dapatkan weather untuk multiple cities dengan optimasi
  getWeatherForCities: async (cities) => {
    try {
      // Batasi concurrent requests untuk menghindari rate limit
      const batchSize = 5;
      const results = [];

      for (let i = 0; i < cities.length; i += batchSize) {
        const batch = cities.slice(i, i + batchSize);
        const promises = batch.map(city => 
          weatherAPI.getByCoords(city.lat, city.lon)
            .then(data => ({
              ...city,
              temp: data.main.temp,
              condition: data.weather[0].main,
              description: data.weather[0].description,
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              icon: data.weather[0].icon,
              feelsLike: data.main.feels_like,
              pressure: data.main.pressure
            }))
            .catch(error => {
              console.error(`Failed to fetch weather for ${city.name}:`, error);
              return null;
            })
        );

        const batchResults = await Promise.all(promises);
        results.push(...batchResults.filter(r => r !== null));

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < cities.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching weather for cities:', error);
      return [];
    }
  },
};