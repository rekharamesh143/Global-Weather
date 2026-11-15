# SkyCast — Global Weather Forecast

A responsive React + Vite weather app. Search cities around the world and view current conditions plus a 7-day forecast.

## Features
- Worldwide city search using Open-Meteo Geocoding API
- Current temperature, feels-like temperature, humidity, wind and precipitation
- 7-day min/max temperature, weather conditions and precipitation probability
- Sunrise and sunset
- Celsius / Fahrenheit toggle
- Recent city shortcuts
- Responsive desktop and mobile layout

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP and open the project folder in a terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown by Vite (usually http://localhost:5173).

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel should detect Vite automatically.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

No API key or environment variables are required for the included Open-Meteo endpoints.

## Weather data
This app uses:
- Open-Meteo Geocoding API: https://geocoding-api.open-meteo.com/
- Open-Meteo Forecast API: https://api.open-meteo.com/

Weather data attribution: Open-Meteo (https://open-meteo.com/). Review its current usage terms before commercial deployment. The free hosted API is intended for non-commercial use; commercial usage may require a suitable plan.
