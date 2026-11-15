import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Wind, Droplets, Sunrise, Sunset, Gauge, CloudSun, RefreshCw, LocateFixed } from 'lucide-react';

const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const API = 'https://api.open-meteo.com/v1/forecast';

function weatherInfo(code) {
  if (code === 0) return ['Clear sky', '☀️'];
  if ([1, 2].includes(code)) return ['Mostly clear', '🌤️'];
  if (code === 3) return ['Cloudy', '☁️'];
  if ([45, 48].includes(code)) return ['Foggy', '🌫️'];
  if ([51, 53, 55, 56, 57].includes(code)) return ['Drizzle', '🌦️'];
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ['Rain', '🌧️'];
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ['Snow', '❄️'];
  if ([95, 96, 99].includes(code)) return ['Thunderstorm', '⛈️'];
  return ['Variable conditions', '🌥️'];
}

function dayName(date, index) {
  if (index === 0) return 'Today';
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
}
const fmtTime = (value) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

export default function App() {
  const [query, setQuery] = useState('Bengaluru');
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [recent, setRecent] = useState([]);

  async function loadCity(cityName) {
    if (!cityName.trim()) return;
    setLoading(true); setError('');
    try {
      const geoRes = await fetch(`${GEO}?name=${encodeURIComponent(cityName)}&count=8&language=en&format=json`);
      if (!geoRes.ok) throw new Error('Could not search for this location.');
      const geo = await geoRes.json();
      if (!geo.results?.length) throw new Error('No matching city found. Try a city name with its country.');
      const place = geo.results[0];
      const params = new URLSearchParams({
        latitude: place.latitude, longitude: place.longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,wind_speed_10m_max',
        forecast_days: '7', timezone: 'auto'
      });
      const wxRes = await fetch(`${API}?${params}`);
      if (!wxRes.ok) throw new Error('Weather service is temporarily unavailable.');
      const wx = await wxRes.json();
      setLocation(place); setWeather(wx);
      setRecent(prev => [place, ...prev.filter(p => p.id !== place.id && !(p.name === place.name && p.country_code === place.country_code))].slice(0, 5));
      setQuery(place.name);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadCity('Bengaluru'); }, []);

  const current = weather?.current;
  const daily = weather?.daily;
  const convert = (n) => unit === 'fahrenheit' ? Math.round(n * 9 / 5 + 32) : Math.round(n);
  const unitLabel = unit === 'celsius' ? '°C' : '°F';
  const today = current ? weatherInfo(current.weather_code) : ['Loading', '🌤️'];
  const days = useMemo(() => daily?.time?.map((date, i) => ({
    date, name: dayName(date, i), code: daily.weather_code[i],
    max: daily.temperature_2m_max[i], min: daily.temperature_2m_min[i],
    rain: daily.precipitation_probability_max[i], wind: daily.wind_speed_10m_max[i]
  })) || [], [daily]);

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon">☀</span><span>skycast<span className="brand-dot">.</span></span></a>
        <div className="top-note"><span className="live-dot"></span> Global weather, at a glance</div>
        <div className="unit-switch" aria-label="Temperature unit">
          <button className={unit === 'celsius' ? 'selected' : ''} onClick={() => setUnit('celsius')}>°C</button>
          <button className={unit === 'fahrenheit' ? 'selected' : ''} onClick={() => setUnit('fahrenheit')}>°F</button>
        </div>
      </header>

      <section className="intro">
        <p className="eyebrow">YOUR WORLD, WEATHERWISE</p>
        <h1>Forecasts for <em>everywhere.</em></h1>
        <p className="subhead">Find current conditions and the next 7 days for any city around the globe.</p>
        <form className="search" onSubmit={e => { e.preventDefault(); loadCity(query); }}>
          <Search size={19} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a city or place..." aria-label="Search a city or place" />
          <button type="submit" disabled={loading}>{loading ? <RefreshCw className="spin" size={17}/> : 'Search'}</button>
        </form>
        {error && <p className="error">{error}</p>}
        {recent.length > 1 && <div className="recent"><span>RECENT</span>{recent.slice(1).map((p, i) => <button key={`${p.id}-${i}`} onClick={() => loadCity(p.name)}>{p.name}</button>)}</div>}
      </section>

      {weather && location && current && (
        <>
          <section className="current-card">
            <div className="current-main">
              <div className="location-line"><MapPin size={15}/>{location.name}{location.admin1 ? `, ${location.admin1}` : ''}, {location.country}</div>
              <div className="current-temp">{convert(current.temperature_2m)}<span>{unitLabel}</span></div>
              <div className="condition">{today[1]} <span>{today[0]}</span></div>
              <p className="feels">Feels like {convert(current.apparent_temperature)}{unitLabel}</p>
            </div>
            <div className="weather-illustration" aria-hidden="true">{today[1]}</div>
            <div className="current-stats">
              <div className="stat"><Droplets/><div><small>Humidity</small><strong>{current.relative_humidity_2m}%</strong></div></div>
              <div className="stat"><Wind/><div><small>Wind speed</small><strong>{Math.round(current.wind_speed_10m)} km/h</strong></div></div>
              <div className="stat"><Gauge/><div><small>Precipitation</small><strong>{current.precipitation} mm</strong></div></div>
            </div>
            <div className="updated">Local time · {weather.timezone}</div>
          </section>

          <section className="forecast-section">
            <div className="section-heading"><div><p className="eyebrow">PLAN AHEAD</p><h2>7-day forecast</h2></div><span className="forecast-tag">NEXT 7 DAYS</span></div>
            <div className="forecast-grid">
              {days.map((d, i) => {
                const info = weatherInfo(d.code);
                return <article className={`day-card ${i === 0 ? 'today' : ''}`} key={d.date}>
                  <p className="day-name">{d.name}</p>
                  <p className="day-date">{new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                  <div className="day-icon">{info[1]}</div>
                  <p className="day-condition">{info[0]}</p>
                  <div className="temps"><strong>{convert(d.max)}°</strong><span>{convert(d.min)}°</span></div>
                  <div className="day-extra"><span><Droplets size={13}/>{d.rain ?? 0}%</span><span><Wind size={13}/>{Math.round(d.wind)} km/h</span></div>
                </article>;
              })}
            </div>
          </section>

          <section className="sun-card">
            <div className="sun-item"><Sunrise/><div><small>Sunrise</small><strong>{fmtTime(daily.sunrise[0])}</strong></div></div>
            <div className="sun-divider"></div>
            <div className="sun-item"><Sunset/><div><small>Sunset</small><strong>{fmtTime(daily.sunset[0])}</strong></div></div>
            <div className="sun-foot">Today's daylight in {location.name}</div>
          </section>
        </>
      )}
      {!weather && loading && <div className="loading"><CloudSun size={34}/>Loading forecast…</div>}
      <footer>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Forecasts are estimates and may change.</footer>
    </main>
  );
}