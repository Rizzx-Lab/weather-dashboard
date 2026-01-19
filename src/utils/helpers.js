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