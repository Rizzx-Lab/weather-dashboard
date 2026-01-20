import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { WiThermometer, WiHumidity, WiStrongWind, WiBarometer, WiRaindrop, WiCloud } from 'react-icons/wi';

const AdvancedWeatherCard = ({ weatherData, unit = 'C' }) => {
  if (!weatherData) return null;

  const { temp, humidity, pressure, feels_like } = weatherData.main;
  const { speed: windSpeed } = weatherData.wind;
  
  // Convert temperature based on unit
  const convertTemp = (tempInCelsius) => {
    if (unit === 'F') {
      return Math.round((tempInCelsius * 9/5) + 32);
    }
    return Math.round(tempInCelsius);
  };

  // Spring animation for temperature
  const tempSpring = useSpring({
    number: convertTemp(temp),
    from: { number: 0 },
    config: { tension: 120, friction: 14 },
  });

  // Framer motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const metrics = [
    { icon: WiThermometer, label: 'Terasa', value: convertTemp(feels_like), unit: '°', color: 'text-orange-500' },
    { icon: WiHumidity, label: 'Kelembaban', value: humidity, unit: '%', color: 'text-blue-500' },
    { icon: WiStrongWind, label: 'Angin', value: windSpeed.toFixed(1), unit: ' m/s', color: 'text-cyan-500' },
    { icon: WiBarometer, label: 'Tekanan', value: pressure, unit: ' hPa', color: 'text-purple-500' },
  ];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                rounded-3xl shadow-2xl p-8 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <div className="relative z-10">
        {/* Header with animated temperature */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 capitalize flex items-center gap-2">
                <WiCloud className="text-2xl" />
                {weatherData.weather[0].description}
              </p>
            </div>
            <div className="text-right">
              <animated.div className="text-6xl font-bold text-gray-800 dark:text-white">
                {tempSpring.number.to((val) => `${Math.round(val)}°${unit}`)}
              </animated.div>
            </div>
          </div>
        </motion.div>

        {/* Animated metrics grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm 
                       rounded-2xl p-4 text-center hover:shadow-lg transition-shadow"
            >
              <metric.icon className={`text-4xl ${metric.color} mx-auto mb-2`} />
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {metric.value}{metric.unit}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated progress bar for temperature range */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Rentang Suhu</span>
              <span>
                {convertTemp(weatherData.main.temp_min)}° - {convertTemp(weatherData.main.temp_max)}°
              </span>
            </div>
            <motion.div 
              className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((temp - weatherData.main.temp_min) / 
                    (weatherData.main.temp_max - weatherData.main.temp_min)) * 100}%` 
                }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Humidity bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <WiRaindrop className="text-lg" />
                Kelembaban
              </span>
              <span>{humidity}%</span>
            </div>
            <motion.div 
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${humidity}%` }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdvancedWeatherCard;