import {
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm,
  WiFog, WiDayCloudy, WiNightClear, WiHumidity, WiStrongWind,
  WiBarometer, WiThermometer, WiSunrise, WiSunset, WiRainMix
} from 'react-icons/wi';
import { FaTemperatureHigh, FaTemperatureLow, FaWind } from 'react-icons/fa';

// Map icon code dari OpenWeather ke icon React
export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': WiDaySunny,      // cerah siang
    '01n': WiNightClear,    // cerah malam
    '02d': WiDayCloudy,     // sedikit awan siang
    '02n': WiDayCloudy,     // sedikit awan malam
    '03d': WiCloudy,        // berawan
    '03n': WiCloudy,
    '04d': WiCloudy,        // mendung
    '04n': WiCloudy,
    '09d': WiRainMix,       // hujan ringan
    '09n': WiRainMix,
    '10d': WiRain,          // hujan
    '10n': WiRain,
    '11d': WiThunderstorm,  // badai petir
    '11n': WiThunderstorm,
    '13d': WiSnow,          // salju
    '13n': WiSnow,
    '50d': WiFog,           // kabut
    '50n': WiFog,
  };

  return iconMap[iconCode] || WiDaySunny;
};

export const weatherMetrics = {
  humidity: WiHumidity,
  pressure: WiBarometer,
  wind: FaWind,
  temp: WiThermometer,
  tempHigh: FaTemperatureHigh,
  tempLow: FaTemperatureLow,
  sunrise: WiSunrise,
  sunset: WiSunset
};