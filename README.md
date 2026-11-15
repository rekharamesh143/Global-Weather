# SkyCast — Global Weather Forecast (fixed)
This version fixes the blank-page error `ReferenceError: Can't find variable: React` by importing React in JSX modules and enabling the Vite React plugin with the automatic JSX runtime.

## Features
- Search cities worldwide
- Current conditions, temperature, feels-like, humidity, wind and precipitation
- 7-day min/max forecast, rain probability and wind
- Sunrise and sunset
- Celsius/Fahrenheit toggle and recent searches
- Responsive layout

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Build
```bash
npm run build
```

## Deploy updated version
1. Replace the files in your existing GitHub repository with the contents of this ZIP (keep the folder structure).
2. Commit and push to the same branch connected to Vercel, usually `main`.
3. Vercel will automatically create a new deployment.
4. Wait for Ready, then open Visit and hard-refresh the page.

No API key is required for the Open-Meteo endpoints used here. Check Open-Meteo's current terms before commercial use.
