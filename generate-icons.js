// generate-icons.js
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [64, 192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3B82F6');
  gradient.addColorStop(1, '#1E40AF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Draw sun/cloud icon
  ctx.fillStyle = '#FFFFFF';
  
  if (size >= 192) {
    // Sun
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloud
    ctx.beginPath();
    ctx.ellipse(size/2 + size/6, size/2, size/3, size/6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Save to file
  const filename = `public/pwa-${size}x${size}.png`;
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
});

console.log('✅ Icons generated successfully!');