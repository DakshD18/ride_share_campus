// src/config/googleMaps.js
// ─────────────────────────────────────────────────────────────────────────────
// Google Maps configuration used across the app
// ─────────────────────────────────────────────────────────────────────────────

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Libraries to load with the Maps API
export const MAPS_LIBRARIES = ['places', 'directions'];

// Default map center: IIT Delhi (change to your campus coordinates)
export const DEFAULT_CENTER = { lat: 28.5459, lng: 77.1926 };

// Dark map style that matches the app's dark theme
export const DARK_MAP_STYLE = [
  { elementType: 'geometry',   stylers: [{ color: '#0d1b2a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1b2a' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#746855' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi',                     elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park',                elementType: 'geometry',         stylers: [{ color: '#0a1f0a' }] },
  { featureType: 'poi.park',                elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road',                    elementType: 'geometry',         stylers: [{ color: '#1a2744' }] },
  { featureType: 'road',                    elementType: 'geometry.stroke',  stylers: [{ color: '#1a3a5c' }] },
  { featureType: 'road',                    elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway',            elementType: 'geometry',         stylers: [{ color: '#1e3a5c' }] },
  { featureType: 'road.highway',            elementType: 'geometry.stroke',  stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway',            elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit',                 elementType: 'geometry',         stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station',         elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water',                   elementType: 'geometry',         stylers: [{ color: '#07111a' }] },
  { featureType: 'water',                   elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water',                   elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

// Green variant for driver map
export const DARK_MAP_STYLE_GREEN = DARK_MAP_STYLE.map(s => {
  if (s.featureType === 'road' && !s.featureType?.includes('highway')) {
    return { ...s, stylers: s.stylers.map(st => st.color ? { color: '#0f2318' } : st) };
  }
  return s;
});
