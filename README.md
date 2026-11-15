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


## Best Time to Visit advisor (v1.0.2)
The app requests hourly temperature, precipitation probability, wind speed and weather codes for the 7-day forecast. It scores 3-hour daytime windows and ranks the best day/time for outdoor sightseeing. The score is a transparent heuristic, not an AI prediction or guarantee. It does not use historical climate averages, attraction opening hours, crowds or local events.


## Nearby places to visit (v1.0.3)
- Looks up named attractions, museums, viewpoints, parks, gardens, zoos and historic places within 15 km of the selected city coordinates using the OpenStreetMap Overpass API.
- Prioritises indoor attractions when the best forecast window indicates rain, and outdoor attractions otherwise.
- Includes Google Maps directions/search links and optional official website links when mapped.
- Place coverage depends on OpenStreetMap community data and the public Overpass service; listings/opening hours may be incomplete.
