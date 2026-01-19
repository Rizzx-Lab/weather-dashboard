import React from 'react';
import { WiDaySunny, WiCloud, WiRain, WiDayCloudy } from 'react-icons/wi';
import { formatTime, convertTemp } from '../utils/helpers';

const ForecastChart = ({ forecastData, unit = 'C' }) => {
  if (!forecastData || !forecastData.list) return null;

  // Ambil 5 data pertama (15 jam ke depan)
  const hourlyForecast = forecastData.list.slice(0, 5);

  const getWeatherIcon = (weatherId) => {
    if (weatherId === 800) return WiDaySunny;
    if (weatherId >= 200 && weatherId < 300) return WiRain;
    if (weatherId >= 300 && weatherId < 600) return WiRain;
    if (weatherId >= 800 && weatherId < 900) return WiCloud;
    return WiDayCloudy;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Prakiraan 15 Jam ke Depan</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {hourlyForecast.map((hour, idx) => {
            const WeatherIcon = getWeatherIcon(hour.weather[0].id);
            const time = formatTime(hour.dt);
            const temp = convertTemp(hour.main.temp, unit);
            
            return (
              <div key={idx} className="flex flex-col items-center min-w-[120px]">
                <p className="text-lg font-semibold text-gray-800 mb-2">{time}</p>
                <WeatherIcon className="text-5xl text-blue-500 mb-3" />
                <p className="text-2xl font-bold text-gray-800 mb-1">{temp}°{unit}</p>
                <p className="text-gray-600 text-sm capitalize">{hour.weather[0].description}</p>
                <div className="mt-3 w-full">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>💧 {hour.main.humidity}%</span>
                    <span>💨 {hour.wind.speed.toFixed(1)} m/s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Ringkasan Prakiraan</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Suhu Rata-rata</p>
            <p className="text-xl font-bold text-gray-800">
              {convertTemp(
                hourlyForecast.reduce((sum, hour) => sum + hour.main.temp, 0) / hourlyForecast.length,
                unit
              )}°{unit}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Kondisi Dominan</p>
            <p className="text-xl font-bold text-gray-800 capitalize">
              {hourlyForecast[0].weather[0].main}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Perubahan Suhu</p>
            <p className="text-xl font-bold text-gray-800">
              {convertTemp(hourlyForecast[0].main.temp, unit)}° → {convertTemp(hourlyForecast[hourlyForecast.length - 1].main.temp, unit)}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;