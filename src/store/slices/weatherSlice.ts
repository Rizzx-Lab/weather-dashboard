import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, ForecastData, AirQualityData } from '@/types/weather';
import { weatherAPI } from '@/utils/api';

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

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string, { rejectWithValue }) => {
    try {
      const [current, forecast, airQuality] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city),
        weatherAPI.getAirQuality(city),
      ]);
      return { current, forecast, airQuality };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeatherByCoords = createAsyncThunk(
  'weather/fetchWeatherByCoords',
  async ({ lat, lon }: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const current = await weatherAPI.getByCoords(lat, lon);
      return { current };
    } catch (error: any) {
      return rejectWithValue(error.message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
        state.airQuality = action.payload.airQuality;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.current = action.payload.current;
      });
  },
});

export const { setUnit, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;