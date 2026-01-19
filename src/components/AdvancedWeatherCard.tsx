import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { WeatherData } from '@/types/weather';
import { convertTemp, formatTime } from '@/utils/helpers';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';

interface AdvancedWeatherCardProps {
  weatherData: WeatherData;
  unit: 'metric' | 'imperial';
}

const AdvancedWeatherCard: React.FC<AdvancedWeatherCardProps> = ({ weatherData, unit }) => {
  const { temp, humidity, pressure } = weatherData.main;
  const { speed: windSpeed } = weatherData.wind;
  
  // Spring animation for temperature
  const tempSpring = useSpring({
    number: temp,
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
        className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"
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
      
      <div className="relative z-10">
        {/* Header with animated temperature */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {formatTime(weatherData.dt, 'full')}
              </p>
            </div>
            <div className="text-right">
              <animated.div className="text-5xl font-bold text-gray-800 dark:text-white">
                {tempSpring.number.to((val) => `${convertTemp(val, unit === 'metric' ? 'C' : 'F')}°${unit === 'metric' ? 'C' : 'F'}`)}
              </animated.div>
              <p className="text-gray-600 dark:text-gray-300 capitalize">
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Animated metrics grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: WiThermometer, label: 'Feels Like', value: weatherData.main.feels_like, unit: '°' },
            { icon: WiHumidity, label: 'Humidity', value: humidity, unit: '%' },
            { icon: WiStrongWind, label: 'Wind Speed', value: windSpeed, unit: 'm/s' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm 
                       rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <metric.icon className="text-4xl text-blue-500 dark:text-blue-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {convertTemp(metric.value, unit === 'metric' ? 'C' : 'F')}
                {metric.unit}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated progress bars */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span>Temperature Range</span>
              <span>
                {convertTemp(weatherData.main.temp_min, unit === 'metric' ? 'C' : 'F')}° - 
                {convertTemp(weatherData.main.temp_max, unit === 'metric' ? 'C' : 'F')}°
              </span>
            </div>
            <motion.div 
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((weatherData.main.temp - weatherData.main.temp_min) / 
                    (weatherData.main.temp_max - weatherData.main.temp_min)) * 100}%` 
                }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdvancedWeatherCard;