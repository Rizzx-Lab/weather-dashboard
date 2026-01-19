import React from 'react';
import { getWeatherIcon, weatherMetrics } from '../utils/weatherIcons';
import { convertTemp, formatTime, formatDate, getWeatherDescription, getWindDirection } from '../utils/helpers';
import { WiThermometer, WiHumidity, WiBarometer } from 'react-icons/wi';
import { FaWind, FaTemperatureHigh, FaTemperatureLow, FaSun, FaMoon } from 'react-icons/fa';

const WeatherCard = ({ weatherData, unit = 'C' }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, humidity, feels_like, pressure, temp_max, temp_min },
    weather,
    wind: { speed, deg },
    sys: { country, sunrise, sunset },
    dt,
    coord
  } = weatherData;

  const WeatherIcon = getWeatherIcon(weather[0].icon);
  const description = getWeatherDescription(weather[0].id);
  const windDirection = getWindDirection(deg);

  const metrics = [
    { icon: WiThermometer, label: 'Terasa', value: `${convertTemp(feels_like, unit)}°${unit}`, color: 'text-orange-500' },
    { icon: WiHumidity, label: 'Kelembaban', value: `${humidity}%`, color: 'text-blue-500' },
    { icon: FaWind, label: 'Angin', value: `${speed} m/s`, subvalue: windDirection, color: 'text-gray-500' },
    { icon: WiBarometer, label: 'Tekanan', value: `${pressure} hPa`, color: 'text-purple-500' },
    { icon: FaTemperatureHigh, label: 'Max', value: `${convertTemp(temp_max, unit)}°${unit}`, color: 'text-red-500' },
    { icon: FaTemperatureLow, label: 'Min', value: `${convertTemp(temp_min, unit)}°${unit}`, color: 'text-cyan-500' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header dengan lokasi dan tanggal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-3xl font-bold text-gray-800">{name}, {country}</h2>
          </div>
          <p className="text-gray-600">{formatDate(dt)}</p>
          <p className="text-sm text-gray-500 mt-1">
            Koordinat: {coord?.lat?.toFixed(4)}, {coord?.lon?.toFixed(4)}
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <WeatherIcon className="text-6xl text-blue-500 mr-4" />
          <div className="text-right">
            <p className="text-5xl font-bold text-gray-800">
              {convertTemp(temp, unit)}°{unit}
            </p>
            <p className="text-gray-600 text-lg mt-1 capitalize">{weather[0].description}</p>
          </div>
        </div>
      </div>

      {/* Grid metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-gray-50 rounded-2xl p-4 text-center hover:bg-gray-100 transition-colors">
              <Icon className={`text-3xl ${metric.color} mx-auto mb-2`} />
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-gray-800">{metric.value}</p>
              {metric.subvalue && (
                <p className="text-xs text-gray-500 mt-1">Arah: {metric.subvalue}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sunrise & Sunset dengan progress bar */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Matahari</h3>
        <div className="relative">
          {/* Progress bar timeline */}
          <div className="h-2 bg-gray-200 rounded-full mb-8 relative">
            <div className="absolute h-4 w-4 bg-yellow-500 rounded-full -top-1 animate-pulse" 
                 style={{ left: '25%' }}>
              <FaSun className="text-white text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="absolute h-4 w-4 bg-orange-500 rounded-full -top-1" 
                 style={{ left: '75%' }}>
              <FaMoon className="text-white text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaSun className="text-yellow-500" />
                <p className="font-semibold text-gray-800">Terbit</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatTime(sunrise)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 mb-2">Sekarang</p>
              <p className="text-2xl font-bold text-gray-800">{formatTime(dt)}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaMoon className="text-orange-500" />
                <p className="font-semibold text-gray-800">Terbenam</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatTime(sunset)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Data real-time • </span>
          <span className="text-green-600 font-medium">OpenWeather API</span>
        </div>
        <div className="text-right">
          <p>Update: {formatTime(dt)}</p>
          <p className="text-xs">Data diperbarui setiap 10 menit</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;