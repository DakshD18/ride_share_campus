// src/components/RideMap.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable Google Map component used in both Passenger and Driver dashboards.
//
// Features:
//  • Dark-themed map matching the app's aesthetic
//  • Places Autocomplete for pickup/drop inputs
//  • DirectionsRenderer — shows real route polyline between two addresses
//  • Custom SVG markers for pickup (green), drop (red), and car (blue/green)
//  • Animated car marker that moves along the route when the ride is active
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, Autocomplete, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MAPS_LIBRARIES, DEFAULT_CENTER, DARK_MAP_STYLE } from '../config/googleMaps';
import { useGoogleMapsAPI } from './GoogleMapsProvider';

/* ── Map container styles ──────────────────────────────────────────────── */
const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '1rem' };

const mapOptions = {
  styles: DARK_MAP_STYLE,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
};

/* ── Custom SVG marker icons ────────────────────────────────────────────── */
const PICKUP_ICON = {
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  fillColor: '#10b981',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1.6,
  anchor: { x: 12, y: 22 },
};

const DROP_ICON = {
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  fillColor: '#ef4444',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1.6,
  anchor: { x: 12, y: 22 },
};

const CAR_ICON = (color = '#3b82f6') => ({
  path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  fillColor: color,
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: '#ffffff',
  scale: 1.4,
  anchor: { x: 12, y: 12 },
});


/* ═══════════════════════════════════════════════════════════════════════════
   AUTOCOMPLETE INPUT — wraps a Places Autocomplete on any text input
══════════════════════════════════════════════════════════════════════════ */
export const PlaceAutocomplete = ({ placeholder, value, onChange, onPlaceSelect, className, style }) => {
  const { isLoaded, loadError } = useGoogleMapsAPI();

  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = useCallback((ac) => setAutocomplete(ac), []);

  const onPlaceChanged = useCallback(() => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    const address = place.formatted_address || place.name;
    onChange(address);
    if (onPlaceSelect) {
      onPlaceSelect({
        address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }, [autocomplete, onChange, onPlaceSelect]);

  if (loadError) {
    return <input className={className} placeholder="Map API Error" disabled style={{ ...style, opacity: 0.5 }} />;
  }

  if (!isLoaded) {
    return <input className={className} placeholder="Loading places..." disabled style={{ ...style, opacity: 0.5 }} />;
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
        autoComplete="off"
      />
    </Autocomplete>
  );
};


/* ═══════════════════════════════════════════════════════════════════════════
   RIDE MAP — the main map component
   Props:
     height        — CSS height string (e.g. '280px')
     pickupCoords  — { lat, lng } or null
     dropCoords    — { lat, lng } or null
     showCar       — boolean, shows animated car marker on route
     accentColor   — 'blue' (passenger) | 'green' (driver)
══════════════════════════════════════════════════════════════════════════ */
const RideMap = ({
  height = '280px',
  pickupCoords = null,
  dropCoords = null,
  showCar = false,
  accentColor = 'blue',
}) => {
  const { isLoaded, loadError } = useGoogleMapsAPI();

  const mapRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [carPosition, setCarPosition] = useState(null);
  const animFrameRef = useRef(null);
  const routeIndexRef = useRef(0);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  /* ── Fetch directions when both coords are available ── */
  useEffect(() => {
    if (!isLoaded || !pickupCoords || !dropCoords) {
      setDirections(null);
      return;
    }

    const svc = new window.google.maps.DirectionsService();
    svc.route(
      {
        origin: new window.google.maps.LatLng(pickupCoords.lat, pickupCoords.lng),
        destination: new window.google.maps.LatLng(dropCoords.lat, dropCoords.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          // Start car at pickup
          setCarPosition(pickupCoords);
          routeIndexRef.current = 0;
        }
      }
    );
  }, [isLoaded, pickupCoords, dropCoords]);

  /* ── Animate car along route when showCar = true ── */
  useEffect(() => {
    if (!showCar || !directions) return;

    const steps = directions.routes[0].legs[0].steps;
    const points = steps.flatMap(step =>
      window.google.maps.geometry?.encoding
        ? window.google.maps.geometry.encoding.decodePath(step.polyline.points)
        : [step.start_location, step.end_location]
    );

    let idx = routeIndexRef.current;
    const animate = () => {
      if (idx >= points.length) { idx = 0; }
      const pt = points[idx];
      setCarPosition({ lat: pt.lat(), lng: pt.lng() });
      idx++;
      routeIndexRef.current = idx;
      animFrameRef.current = setTimeout(animate, 120);
    };

    animate();
    return () => { if (animFrameRef.current) clearTimeout(animFrameRef.current); };
  }, [showCar, directions]);

  /* Fit map bounds to show both markers */
  useEffect(() => {
    if (!mapRef.current || !pickupCoords || !dropCoords) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupCoords);
    bounds.extend(dropCoords);
    mapRef.current.fitBounds(bounds, { top: 60, bottom: 60, left: 40, right: 40 });
  }, [pickupCoords, dropCoords]);

  /* ── Render states ── */
  if (loadError) {
    console.error('Google Maps Load Error:', loadError);
    return (
      <div style={{
        height, borderRadius: '1rem', background: '#0d1b2a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#ef4444', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.2)', padding: '1rem', textAlign: 'center'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>⚠️ Map failed to load</div>
        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{loadError?.message || loadError?.toString() || 'Check your API key or network connection.'}</div>
      </div>
    );
  }

  if (!isLoaded) return (
    <div style={{
      height, borderRadius: '1rem', background: '#0d1b2a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: `3px solid rgba(${accentColor === 'green' ? '16,185,129' : '59,130,246'},0.2)`,
          borderTopColor: accentColor === 'green' ? '#10b981' : '#3b82f6',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 0.5rem',
        }} />
        <div style={{ fontSize: '0.78rem', color: '#475569' }}>Loading map...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const carIconColor = accentColor === 'green' ? '#10b981' : '#3b82f6';
  const routeColor = accentColor === 'green' ? '#10b981' : '#3b82f6';



  return (
    <div style={{ height, borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={pickupCoords || DEFAULT_CENTER}
        zoom={pickupCoords ? 15 : 13}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {/* Pickup marker */}
        {pickupCoords && (
          <Marker
            position={pickupCoords}
            icon={PICKUP_ICON}
            title="Pickup"
            zIndex={10}
          />
        )}

        {/* Drop marker */}
        {dropCoords && (
          <Marker
            position={dropCoords}
            icon={DROP_ICON}
            title="Drop"
            zIndex={10}
          />
        )}

        {/* Route polyline */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,          // use our custom markers instead
              polylineOptions: {
                strokeColor: routeColor,
                strokeOpacity: 0.8,
                strokeWeight: 5,
              },
            }}
          />
        )}

        {/* Animated car marker */}
        {showCar && carPosition && (
          <Marker
            position={carPosition}
            icon={CAR_ICON(carIconColor)}
            title="Driver"
            zIndex={20}
          />
        )}
      </GoogleMap>

      {/* "No route" hint */}
      {(!pickupCoords || !dropCoords) && (
        <div style={{
          position: 'absolute', bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          padding: '0.35rem 0.85rem', borderRadius: '999px',
          fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {!pickupCoords && !dropCoords
            ? 'Enter locations to see the route'
            : !dropCoords ? 'Enter drop location to see route'
              : 'Enter pickup location'}
        </div>
      )}
    </div>
  );
};

export default RideMap;
