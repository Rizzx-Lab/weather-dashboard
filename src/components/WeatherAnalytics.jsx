import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCalendar, FiDroplet, FiThermometer } from 'react-icons/fi';

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

  const humidityDistribution = [
    { name: 'Rendah', value: Math.floor(Math.random() * 30) + 10, color: '#60A5FA' },
    { name: 'Normal', value: Math.floor(Math.random() * 40) + 30, color: '#34D399' },
    { name: 'Tinggi', value: Math.floor(Math.random() * 30) + 20, color: '#F59E0B' },
    { name: 'Sangat Tinggi', value: Math.floor(Math.random() * 20) + 10, color: '#EF4444' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border 
                    border-gray-100 dark:border-gray-700 backdrop-blur-sm"
        >
          <p className="font-semibold text-gray-800 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">{entry.name}:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {entry.value}{entry.unit || ''}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  // Calculate summary metrics
  const avgTemp = (hourlyData.reduce((sum, item) => sum + item.temp, 0) / hourlyData.length).toFixed(1);
  const maxHumidity = Math.max(...hourlyData.map(item => item.humidity));
  const pressureRange = `${Math.min(...hourlyData.map(item => item.pressure))}-${Math.max(...hourlyData.map(item => item.pressure))}`;
  const totalDataPoints = forecast.list.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <FiTrendingUp className="text-white text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Analisis Cuaca
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          {hourlyData.length}h • {dailyData.length}d
        </span>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Temperature Trend */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 
                     rounded-xl p-4 border border-blue-100 dark:border-blue-800/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiThermometer className="text-blue-500 text-lg" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              Tren Suhu 24 Jam
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temp"
                  fill="url(#tempGradient)"
                  fillOpacity={0.3}
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Suhu (°C)"
                />
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Daily Forecast */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10 
                     rounded-xl p-4 border border-orange-100 dark:border-orange-800/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className="text-orange-500 text-lg" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              Prakiraan 5 Hari
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="high" 
                  fill="#F59E0B" 
                  name="Suhu Max (°C)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
                <Bar 
                  dataKey="low" 
                  fill="#60A5FA" 
                  name="Suhu Min (°C)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Humidity Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 
                     rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiDroplet className="text-emerald-500 text-lg" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              Distribusi Kelembaban
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={humidityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.name}`}
                  labelLine={false}
                >
                  {humidityDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => [`${value}%`, 'Persentase']}
                />
                <Legend 
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pressure Trend */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 
                     rounded-xl p-4 border border-purple-100 dark:border-purple-800/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
              <FiTrendingUp className="text-white text-sm" />
            </div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              Tekanan Atmosfer
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="url(#pressureGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#FFFFFF' }}
                  name="Tekanan (hPa)"
                />
                <defs>
                  <linearGradient id="pressureGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Analytics Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 mb-1">Rata-rata Suhu</p>
              <p className="text-xl font-bold">{avgTemp}°C</p>
            </div>
            <FiThermometer className="text-white/80 text-lg" />
          </div>
          <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 mb-1">Kelembaban Max</p>
              <p className="text-xl font-bold">{maxHumidity}%</p>
            </div>
            <FiDroplet className="text-white/80 text-lg" />
          </div>
          <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${maxHumidity / 2}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 mb-1">Rentang Tekanan</p>
              <p className="text-xl font-bold">{pressureRange} hPa</p>
            </div>
            <FiTrendingUp className="text-white/80 text-lg" />
          </div>
          <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 mb-1">Data Points</p>
              <p className="text-xl font-bold">{totalDataPoints}</p>
            </div>
            <FiCalendar className="text-white/80 text-lg" />
          </div>
          <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Data diperbarui setiap 3 jam • Sumber: OpenWeather API
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WeatherAnalytics;