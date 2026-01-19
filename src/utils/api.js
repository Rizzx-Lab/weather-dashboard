import axios from 'axios';

// API Key real yang sudah aktif
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '02895eb1363efdd13b1ab2ffb695d75b';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = {
  // Get current weather - REAL
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

  // Get forecast (5 hari) - REAL
  getForecast: async (city) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Prakiraan cuaca tidak tersedia untuk kota ini');
    }
  },

  // Get weather by coordinates - REAL
  getByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );
      return response.data;
    } catch (error) {
      throw new Error('Tidak dapat mengambil data cuaca untuk lokasi ini');
    }
  }
};