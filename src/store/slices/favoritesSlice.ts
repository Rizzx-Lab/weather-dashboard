import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData } from '@/types/weather';

interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  coord: {
    lat: number;
    lon: number;
  };
  weather: {
    temp: number;
    icon: string;
    description: string;
  };
  lastUpdated: number;
}

interface FavoritesState {
  cities: FavoriteCity[];
  loading: boolean;
}

const initialState: FavoritesState = {
  cities: [],
  loading: false,
};

export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async (_, { getState }) => {
    const saved = localStorage.getItem('weather-favorites');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (weatherData: WeatherData, { rejectWithValue }) => {
    try {
      const favorite: FavoriteCity = {
        id: weatherData.id,
        name: weatherData.name,
        country: weatherData.sys.country,
        coord: weatherData.coord,
        weather: {
          temp: weatherData.main.temp,
          icon: weatherData.weather[0].icon,
          description: weatherData.weather[0].description,
        },
        lastUpdated: Date.now(),
      };

      const saved = localStorage.getItem('weather-favorites');
      const favorites = saved ? JSON.parse(saved) : [];
      favorites.push(favorite);
      localStorage.setItem('weather-favorites', JSON.stringify(favorites));

      return favorite;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (cityId: number, { rejectWithValue }) => {
    try {
      const saved = localStorage.getItem('weather-favorites');
      const favorites = saved ? JSON.parse(saved) : [];
      const updated = favorites.filter((fav: FavoriteCity) => fav.id !== cityId);
      localStorage.setItem('weather-favorites', JSON.stringify(updated));
      return cityId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFavoritesWeather = createAsyncThunk(
  'favorites/updateWeather',
  async (_, { rejectWithValue }) => {
    try {
      const saved = localStorage.getItem('weather-favorites');
      const favorites = saved ? JSON.parse(saved) : [];
      
      // Update weather for each favorite (simplified)
      const updated = await Promise.all(
        favorites.map(async (fav: FavoriteCity) => {
          // In real app, fetch fresh data for each city
          return {
            ...fav,
            lastUpdated: Date.now(),
          };
        })
      );
      
      localStorage.setItem('weather-favorites', JSON.stringify(updated));
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    reorderFavorites: (state, action: PayloadAction<FavoriteCity[]>) => {
      state.cities = action.payload;
      localStorage.setItem('weather-favorites', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.cities.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.cities = state.cities.filter(city => city.id !== action.payload);
      })
      .addCase(updateFavoritesWeather.fulfilled, (state, action) => {
        state.cities = action.payload;
      });
  },
});

export const { reorderFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;