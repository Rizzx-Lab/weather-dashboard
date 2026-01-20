import axios from 'axios';

// API Key real yang sudah aktif
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '02895eb1363efdd13b1ab2ffb695d75b';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = {
  // Get current weather by city name - REAL
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`
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

  // Get forecast (5 hari) by city name - REAL
  getForecast: async (city) => {
    try {
      // Cek apakah city adalah koordinat (format: "lat,lon")
      if (typeof city === 'string' && city.includes(',')) {
        const [lat, lon] = city.split(',');
        return await weatherAPI.getForecastByCoords(parseFloat(lat), parseFloat(lon));
      }

      const response = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Prakiraan cuaca tidak tersedia untuk kota ini');
    }
  },

  // Get weather by coordinates (latitude, longitude) - REAL
  getByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Tidak dapat mengambil data cuaca untuk lokasi ini');
    }
  },

  // Get forecast by coordinates (latitude, longitude) - NEW!
  getForecastByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Tidak dapat mengambil prakiraan cuaca untuk lokasi ini');
    }
  }
};