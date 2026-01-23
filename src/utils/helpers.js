// src/utils/helpers.js

// Format temperatur (C ke F jika perlu)
export const convertTemp = (temp, unit) => {
  if (unit === 'F') {
    return (temp * 9/5 + 32).toFixed(1);
  }
  return temp.toFixed(1);
};

// Format waktu
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// ✅ DITAMBAHKAN: Format hanya jam saja
export const formatHour = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getHours().toString().padStart(2, '0') + ':00';
};

// Format tanggal lengkap
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Deskripsi cuaca dalam Bahasa Indonesia
export const getWeatherDescription = (id) => {
  const descriptions = {
    200: 'Hujan petir ringan',
    201: 'Hujan petir',
    202: 'Hujan petir lebat',
    210: 'Petir ringan',
    211: 'Petir',
    212: 'Petir lebat',
    300: 'Gerimis ringan',
    301: 'Gerimis',
    302: 'Gerimis lebat',
    310: 'Hujan gerimis ringan',
    311: 'Hujan gerimis',
    312: 'Hujan gerimis lebat',
    500: 'Hujan ringan',
    501: 'Hujan',
    502: 'Hujan lebat',
    503: 'Hujan sangat lebat',
    504: 'Hujan ekstrim',
    511: 'Hujan beku',
    600: 'Salju ringan',
    601: 'Salju',
    602: 'Salju lebat',
    701: 'Kabut',
    711: 'Asap',
    721: 'Kabut tipis',
    731: 'Debu pasir',
    741: 'Kabut tebal',
    751: 'Pasir',
    761: 'Debu',
    762: 'Abu vulkanik',
    771: 'Angin kencang',
    781: 'Tornado',
    800: 'Cerah',
    801: 'Sedikit berawan',
    802: 'Berawan',
    803: 'Mendung',
    804: 'Berawan penuh',
  };
  
  return descriptions[id] || 'Tidak diketahui';
};

// Arah angin dari derajat
export const getWindDirection = (deg) => {
  const directions = ['U', 'TL', 'T', 'TM', 'S', 'BD', 'B', 'BL'];
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index];
};

// ✅ DITAMBAHKAN: Format arah angin lengkap
export const getWindDirectionFull = (deg) => {
  const directions = {
    'N': 'Utara',
    'NE': 'Timur Laut',
    'E': 'Timur',
    'SE': 'Tenggara',
    'S': 'Selatan',
    'SW': 'Barat Daya',
    'W': 'Barat',
    'NW': 'Barat Laut'
  };
  
  const val = Math.floor((deg / 45) + 0.5);
  const arr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dir = arr[val % 8];
  return directions[dir] || dir;
};

// ✅ DITAMBAHKAN: Format kecepatan angin
export const formatWindSpeed = (speed, unit = 'metric') => {
  if (unit === 'imperial') {
    return (speed * 2.237).toFixed(1) + ' mph';
  }
  return speed.toFixed(1) + ' m/s';
};

// ✅ DITAMBAHKAN: Format persentase
export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

// ✅ DITAMBAHKAN: Format tekanan
export const formatPressure = (pressure) => {
  return `${pressure} hPa`;
};

// ✅ DITAMBAHKAN: Format visibilitas
export const formatVisibility = (visibility) => {
  return `${(visibility / 1000).toFixed(1)} km`;
};