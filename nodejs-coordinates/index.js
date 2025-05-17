const fs = require('fs');
const fetch = require('node-fetch');

const INPUT_FILE = 'input.json';
const OUTPUT_FILE = 'output.json';

async function geocode(address) {
  if (!address) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (youremail@example.com)'
      }
    });

    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.error(`Error geocoding "${address}":`, error.message);
  }

  return null;
}

async function enrichJsonWithCoordinates() {
  const raw = fs.readFileSync(INPUT_FILE, 'utf-8');
  const entries = JSON.parse(raw);

  for (const entry of entries) {
    for (const place of entry.places || []) {
      if (place.address && (!place.lat || !place.lng)) {
        console.log(`Geocoding: ${place.title}`);
        const coords = await geocode(place.address);
        if (coords) {
          place.lat = coords.lat;
          place.lng = coords.lng;
        } else {
          console.warn(`❌ Could not geocode: ${place.address}`);
        }
        await new Promise(r => setTimeout(r, 1100)); // Respect rate limit
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  console.log(`✅ Done. Coordinates saved to ${OUTPUT_FILE}`);
}

enrichJsonWithCoordinates();
