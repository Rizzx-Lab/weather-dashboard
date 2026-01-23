// src/components/ForecastChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiThermometer, FiDroplet, FiWind, FiTrendingUp, FiSunrise, FiSunset } from 'react-icons/fi';
import { getWeatherIcon } from '../utils/weatherIcons';
import { formatTime, convertTemp, formatHour } from '../utils/helpers';

const ForecastChart = ({ forecastData, unit = 'C' }) => {
  if (!forecastData || !forecastData.list) return null;

  // ✅ DIPERBAIKI: Ambil 8 data pertama (24 jam ke depan)
  const hourlyForecast = forecastData.list.slice(0, 8);

  // Data untuk summary
  const avgTemp = hourlyForecast.reduce((sum, hour) => sum + hour.main.temp, 0) / hourlyForecast.length;
  const tempChange = Math.abs(hourlyForecast[0].main.temp - hourlyForecast[hourlyForecast.length - 1].main.temp);
  const maxHumidity = Math.max(...hourlyForecast.map(hour => hour.main.humidity));
  const maxWindSpeed = Math.max(...hourlyForecast.map(hour => hour.wind.speed));
  const minTemp = Math.min(...hourlyForecast.map(hour => hour.main.temp));
  const maxTemp = Math.max(...hourlyForecast.map(hour => hour.main.temp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <FiClock className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Prakiraan 24 Jam ke Depan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Detail per 3 jam • {hourlyForecast.length} interval
            </p>
          </div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1 
                       bg-gray-100 dark:bg-gray-700 rounded-full">
          {hourlyForecast.length * 3} jam
        </span>
      </div>

      {/* Hourly Forecast Cards */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {hourlyForecast.map((hour, idx) => {
            const WeatherIcon = getWeatherIcon(hour.weather[0].icon);
            const time = formatTime(hour.dt);
            const hourOnly = formatHour(hour.dt);
            const temp = convertTemp(hour.main.temp, unit);
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 
                         rounded-xl p-4 border border-gray-100 dark:border-gray-700 
                         min-w-[140px] text-center transition-all duration-200"
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {hourOnly}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  {time.includes('AM') ? 'Pagi' : time.includes('PM') ? 'Malam' : 'Siang'}
                </p>
                
                <div className="mb-3">
                  <WeatherIcon className="text-4xl text-blue-500 mx-auto" />
                </div>
                
                <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {temp}°{unit}
                </p>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mb-3">
                  {hour.weather[0].description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <FiDroplet className="text-blue-400 text-xs" />
                      <span className="text-gray-500 dark:text-gray-400">Hum</span>
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {hour.main.humidity}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <FiWind className="text-cyan-400 text-xs" />
                      <span className="text-gray-500 dark:text-gray-400">Wind</span>
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {hour.wind.speed.toFixed(1)} m/s
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-gray-500 dark:text-gray-400">Pres</span>
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {hour.main.pressure} hPa
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weather Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" />
            Ringkasan 24 Jam
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(hourlyForecast[0].dt)} - {formatTime(hourlyForecast[hourlyForecast.length - 1].dt)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 
                     rounded-xl p-4 border border-blue-100 dark:border-blue-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiThermometer className="text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Suhu Rata-rata</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {convertTemp(avgTemp, unit)}°{unit}
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Min: {convertTemp(minTemp, unit)}° • Max: {convertTemp(maxTemp, unit)}°
            </div>
            <div className="mt-3 h-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${((avgTemp - minTemp) / (maxTemp - minTemp || 1)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 
                     rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiDroplet className="text-emerald-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Kelembaban Max</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {maxHumidity}%
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Rata-rata: {Math.round(hourlyForecast.reduce((sum, h) => sum + h.main.humidity, 0) / hourlyForecast.length)}%
            </div>
            <div className="mt-3 h-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${maxHumidity}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 
                     rounded-xl p-4 border border-amber-100 dark:border-amber-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiWind className="text-amber-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Angin Max</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {maxWindSpeed.toFixed(1)} m/s
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Arah: {hourlyForecast.find(h => h.wind.speed === maxWindSpeed)?.wind.deg || 0}°
            </div>
            <div className="mt-3 h-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(maxWindSpeed * 20, 100)}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                     rounded-xl p-4 border border-purple-100 dark:border-purple-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiThermometer className="text-purple-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Perubahan Suhu</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {convertTemp(tempChange, unit)}°{unit}
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {hourlyForecast[0].main.temp > hourlyForecast[hourlyForecast.length - 1].main.temp ? 'Turun' : 'Naik'}
            </div>
            <div className="mt-3 h-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(tempChange * 10, 100)}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center"
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Data prakiraan setiap 3 jam • {hourlyForecast.length * 3} jam ke depan • Sumber: OpenWeather API
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Update terakhir: {new Date().toLocaleTimeString('id-ID')}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ForecastChart;