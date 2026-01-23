// src/store/slices/weatherSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, ForecastData, AirQualityData } from '@/types/weather';
import { weatherAPI } from './utils/api.js';

interface WeatherState {
  current: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  unit: 'metric' | 'imperial';
}

const initialState: WeatherState = {
  current: null,
  forecast: null,
  airQuality: null,
  loading: false,
  error: null,
  unit: 'metric',
};

// ✅ DIPERBAIKI: fetchWeather dengan error handling yang lebih baik
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string, { rejectWithValue }) => {
    try {
      const [current, forecast] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city), // ✅ Sudah mendapatkan 24 jam data
      ]);
      
      // ✅ Coba dapatkan air quality, tapi jangan gagal jika tidak ada
      let airQuality = null;
      try {
        airQuality = await weatherAPI.getAirQuality(city);
      } catch (aqError) {
        console.log('Air quality data not available, continuing without it');
      }
      
      return { current, forecast, airQuality };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Gagal mengambil data cuaca');
    }
  }
);

// ✅ DIPERBAIKI: fetchWeatherByCoords dengan air quality
export const fetchWeatherByCoords = createAsyncThunk(
  'weather/fetchWeatherByCoords',
  async ({ lat, lon }: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const [current, forecast] = await Promise.all([
        weatherAPI.getByCoords(lat, lon),
        weatherAPI.getForecastByCoords(lat, lon), // ✅ Sudah mendapatkan 24 jam data
      ]);
      
      let airQuality = null;
      try {
        airQuality = await weatherAPI.getAirQualityByCoords(lat, lon);
      } catch (aqError) {
        console.log('Air quality data not available');
      }
      
      return { current, forecast, airQuality };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Gagal mengambil data cuaca untuk lokasi ini');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setUnit: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      state.unit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWeather: (state) => {
      state.current = null;
      state.forecast = null;
      state.airQuality = null;
      state.error = null;
    },
    // ✅ DITAMBAHKAN: Action untuk manual update forecast (untuk 24 jam)
    updateForecastFor24Hours: (state) => {
      if (state.forecast && state.forecast.list) {
        // Pastikan kita hanya mengambil 8 data pertama (24 jam)
        state.forecast = {
          ...state.forecast,
          list: state.forecast.list.slice(0, 8)
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchWeather
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
        state.airQuality = action.payload.airQuality;
        state.error = null;
        
        // ✅ OTOMATIS: Potong forecast menjadi 24 jam (8 data)
        if (state.forecast && state.forecast.list) {
          state.forecast.list = state.forecast.list.slice(0, 8);
        }
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchWeatherByCoords
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
        state.airQuality = action.payload.airQuality;
        state.error = null;
        
        // ✅ OTOMATIS: Potong forecast menjadi 24 jam (8 data)
        if (state.forecast && state.forecast.list) {
          state.forecast.list = state.forecast.list.slice(0, 8);
        }
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUnit, clearError, clearWeather, updateForecastFor24Hours } = weatherSlice.actions;
export default weatherSlice.reducer;