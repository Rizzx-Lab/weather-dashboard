import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';

const WeatherAnalytics = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  // Process data for charts
  const hourlyData = forecast.list.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).getHours() + ':00',
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    pressure: item.main.pressure,
  }));

  const dailyData = forecast.list
    .filter((_, index) => index % 8 === 0)
    .map(item => ({
      day: new Date(item.dt * 1000).toLocaleDateString('id-ID', { weekday: 'short' }),
      high: Math.round(item.main.temp_max),
      low: Math.round(item.main.temp_min),
      precipitation: Math.round(item.pop * 100),
    }));

  const humidityData = [
    { name: 'Nyaman', value: 40, color: '#10B981' },
    { name: 'Sedang', value: 30, color: '#3B82F6' },
    { name: 'Tinggi', value: 20, color: '#8B5CF6' },
    { name: 'Sangat Tinggi', value: 10, color: '#EF4444' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border 
                      border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
    >
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        📊 Analisis Cuaca
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
            📈 Tren Suhu 24 Jam
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="temp"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  stroke="#3B82F6"
                  name="Suhu (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="feels_like"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Terasa (°C)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Forecast */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
            📅 Prakiraan 5 Hari
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="high" fill="#F59E0B" name="Suhu Max (°C)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="low" fill="#3B82F6" name="Suhu Min (°C)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Distribution */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
            💧 Distribusi Kelembaban
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={humidityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {humidityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pressure Trend */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
            🌡️ Tekanan Atmosfer
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Tekanan (hPa)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Rata-rata Suhu</p>
          <p className="text-2xl font-bold">
            {(hourlyData.reduce((sum, item) => sum + item.temp, 0) / hourlyData.length).toFixed(1)}°C
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Kelembaban Max</p>
          <p className="text-2xl font-bold">
            {Math.max(...hourlyData.map(item => item.humidity))}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Rentang Tekanan</p>
          <p className="text-2xl font-bold">
            {Math.min(...hourlyData.map(item => item.pressure))}-
            {Math.max(...hourlyData.map(item => item.pressure))} hPa
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Data Points</p>
          <p className="text-2xl font-bold">{forecast.list.length}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherAnalytics;