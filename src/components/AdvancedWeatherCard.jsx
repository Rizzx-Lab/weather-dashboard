import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { 
  WiThermometer, WiHumidity, WiStrongWind, WiBarometer 
} from 'react-icons/wi';
import { FaSun, FaMoon, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getWeatherIcon } from '../utils/weatherIcons';
import { 
  convertTemp, formatTime, formatDate, getWindDirection 
} from '../utils/helpers';

const AdvancedWeatherCard = ({ weatherData, unit = 'C' }) => {
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

  // Spring animations
  const tempSpring = useSpring({
    number: parseFloat(convertTemp(temp, unit)),
    from: { number: 0 },
    config: { tension: 120, friction: 14, duration: 1500 },
  });

  const feelsLikeSpring = useSpring({
    number: parseFloat(convertTemp(feels_like, unit)),
    from: { number: 0 },
    config: { tension: 100, friction: 20, duration: 1200 },
    delay: 300
  });

  const tempMaxSpring = useSpring({
    number: parseFloat(convertTemp(temp_max, unit)),
    from: { number: 0 },
    config: { tension: 100, friction: 20, duration: 1000 },
    delay: 500
  });

  const tempMinSpring = useSpring({
    number: parseFloat(convertTemp(temp_min, unit)),
    from: { number: 0 },
    config: { tension: 100, friction: 20, duration: 1000 },
    delay: 700
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
    >
      <div className="grid lg:grid-cols-5 gap-0">
        {/* LEFT: Main Weather Display */}
        <div className="lg:col-span-3 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 
                     dark:from-blue-800 dark:via-blue-900 dark:to-cyan-900
                     p-5 lg:p-6 text-white relative overflow-hidden rounded-l-2xl">
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            style={{ transform: 'translate(30%, -30%)' }}
          />
          
          <div className="relative z-10">
            {/* Compact Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-1">{name}</h2>
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <span>{country}</span>
                  <span>•</span>
                  <span>{formatDate(dt)}</span>
                </div>
              </div>
              <div className="text-right text-sm text-blue-100">
                <p>{formatTime(dt)}</p>
              </div>
            </div>

            {/* Main Temperature - Compact Layout */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <animated.p className="text-5xl lg:text-6xl font-bold leading-tight">
                  {tempSpring.number.to((val) => `${Math.round(val)}°${unit}`)}
                </animated.p>
                <motion.p 
                  className="text-base text-blue-100 capitalize mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {weather[0].description}
                </motion.p>
              </div>
              
              <motion.div
                animate={{ 
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.03, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <WeatherIcon className="text-6xl lg:text-7xl opacity-90" />
              </motion.div>
            </div>

            {/* Min/Max Temperature - Compact */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <FaArrowUp className="text-red-300 text-sm" />
                    <p className="text-blue-100 text-xs">Max</p>
                  </div>
                  <animated.p className="text-xl font-bold">
                    {tempMaxSpring.number.to((val) => `${Math.round(val)}°`)}
                  </animated.p>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <FaArrowDown className="text-cyan-300 text-sm" />
                    <p className="text-blue-100 text-xs">Min</p>
                  </div>
                  <animated.p className="text-xl font-bold">
                    {tempMinSpring.number.to((val) => `${Math.round(val)}°`)}
                  </animated.p>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT: Detailed Metrics - Compact */}
        <div className="lg:col-span-2 p-5 lg:p-6 bg-gray-50 dark:bg-gray-900 rounded-r-2xl">
          <div className="space-y-3">
            {/* Metrics Grid - Compact */}
            <div className="grid grid-cols-2 gap-3">
              {/* Feels Like */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded">
                    <WiThermometer className="text-lg text-orange-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Terasa</span>
                </div>
                <div className="text-right">
                  <animated.p className="text-xl font-bold text-gray-800 dark:text-white">
                    {feelsLikeSpring.number.to((val) => `${Math.round(val)}°`)}
                  </animated.p>
                </div>
              </motion.div>

              {/* Humidity */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <WiHumidity className="text-lg text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Kelembaban</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${humidity}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{humidity}%</p>
                </div>
              </motion.div>

              {/* Wind */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 rounded">
                    <WiStrongWind className="text-lg text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Angin</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {getWindDirection(deg)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <motion.div 
                    className="ml-1"
                    animate={{ rotate: deg }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <WiStrongWind className="text-gray-400 dark:text-gray-500 text-lg" />
                  </motion.div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {speed.toFixed(1)}
                  </p>
                </div>
              </motion.div>

              {/* Pressure */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
                    <WiBarometer className="text-lg text-purple-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Tekanan</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {pressure}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    hPa
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sun Times - Compact */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="flex items-center justify-between p-3 bg-gradient-to-r 
                           from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 
                           rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <FaSun className="text-yellow-500 text-sm" />
                    </motion.div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Terbit</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">
                    {formatTime(sunrise)}
                  </span>
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between p-3 bg-gradient-to-r 
                           from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                           rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <FaMoon className="text-blue-500 text-sm" />
                    </motion.div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Terbenam</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">
                    {formatTime(sunset)}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Footer - Compact */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Update: {formatTime(dt)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium">
                    {coord?.lat?.toFixed(2)}, {coord?.lon?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedWeatherCard;