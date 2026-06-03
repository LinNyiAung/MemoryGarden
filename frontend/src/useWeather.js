/**
 * useWeather.js
 * Fetches real-time weather from Open-Meteo (free, no API key required).
 * Requests the user's geolocation, then maps WMO weather codes to a
 * simple weather descriptor the garden can use for visual effects.
 *
 * Returns:
 *  {
 *    weather,        // { condition, label, emoji, temp, windspeed, humidity, raw }
 *    loading,        // boolean
 *    error,          // string | null
 *    locationName,   // string | null  (reverse-geocoded city name)
 *    refresh,        // () => void  — manual re-fetch
 *  }
 *
 * Weather conditions (weather.condition):
 *   'clear' | 'partly-cloudy' | 'cloudy' | 'fog' |
 *   'drizzle' | 'rain' | 'heavy-rain' | 'snow' | 'thunderstorm'
 */

import { useState, useEffect, useCallback } from 'react';

// ─── WMO code → condition mapping ────────────────────────────────────────────
function wmoToCondition(code) {
  if (code === 0)                         return 'clear';
  if (code <= 2)                          return 'partly-cloudy';
  if (code === 3)                         return 'cloudy';
  if (code >= 45 && code <= 48)          return 'fog';
  if (code >= 51 && code <= 57)          return 'drizzle';
  if (code >= 61 && code <= 65)          return code >= 63 ? 'heavy-rain' : 'rain';
  if (code >= 66 && code <= 67)          return 'rain';    // freezing rain → rain
  if (code >= 71 && code <= 77)          return 'snow';
  if (code >= 80 && code <= 82)          return code >= 81 ? 'heavy-rain' : 'rain';
  if (code === 85 || code === 86)        return 'snow';
  if (code >= 95 && code <= 99)          return 'thunderstorm';
  return 'clear';
}

// Human-readable label & emoji per condition
const CONDITION_META = {
  'clear':          { label: 'Clear',         emoji: '☀️'  },
  'partly-cloudy':  { label: 'Partly Cloudy', emoji: '⛅'  },
  'cloudy':         { label: 'Overcast',      emoji: '☁️'  },
  'fog':            { label: 'Foggy',         emoji: '🌫️' },
  'drizzle':        { label: 'Drizzle',       emoji: '🌦️' },
  'rain':           { label: 'Rainy',         emoji: '🌧️' },
  'heavy-rain':     { label: 'Heavy Rain',    emoji: '⛈️'  },
  'snow':           { label: 'Snowy',         emoji: '❄️'  },
  'thunderstorm':   { label: 'Thunderstorm',  emoji: '⛈️'  },
};

// ─── Reverse geocode: lat/lon → city name via nominatim ──────────────────────
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return (
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.county ||
      null
    );
  } catch {
    return null;
  }
}

// ─── Main fetch ───────────────────────────────────────────────────────────────
async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m` +
    `&wind_speed_unit=kmh` +
    `&temperature_unit=celsius` +
    `&timezone=auto`;

  const res  = await fetch(url);
  const data = await res.json();
  const cur  = data.current;

  const condition = wmoToCondition(cur.weathercode);
  const meta      = CONDITION_META[condition];

  return {
    condition,
    label:     meta.label,
    emoji:     meta.emoji,
    temp:      Math.round(cur.temperature_2m),
    windspeed: Math.round(cur.windspeed_10m),
    humidity:  cur.relative_humidity_2m,
    raw:       cur,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useWeather() {
  const [weather,      setWeather]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [coords,       setCoords]       = useState(null);

  // Ask for geolocation once on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => setCoords({ lat: c.latitude, lon: c.longitude }),
      () => {
        setError('Location access denied');
        setLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  const load = useCallback(async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    try {
      const [wx, city] = await Promise.all([
        fetchWeather(coords.lat, coords.lon),
        reverseGeocode(coords.lat, coords.lon),
      ]);
      setWeather(wx);
      setLocationName(city);
    } catch (e) {
      setError('Could not fetch weather');
    } finally {
      setLoading(false);
    }
  }, [coords]);

  // Fetch when we have coords
  useEffect(() => { load(); }, [load]);

  // Refresh every 10 minutes
  useEffect(() => {
    if (!coords) return;
    const id = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [coords, load]);

  return { weather, loading, error, locationName, refresh: load };
}

export { CONDITION_META };
export default useWeather;