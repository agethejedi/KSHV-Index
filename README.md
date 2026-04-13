# KS Engine

KS Engine is a React + TypeScript prototype that calculates a location-sensitive dating / marriage market score and redraws the bell curve whenever the user clicks a metro on the U.S. map.

## What is in this repo

- A working React/Vite front end
- A real clickable U.S. map with metro markers
- Runtime pulls from the official 2024 ACS 1-year API for each selected metro
- A scoring engine that recomputes:
  - KS Score
  - bell-curve percentile
  - demand pool
  - competition pool
  - top drivers

## Census inputs used

This build calls the official Census API for these ACS 1-year tables:

- `B01001` — Sex by Age
- `B02001` — Race
- `B03003` — Hispanic or Latino Origin
- `B12002` — Sex by Marital Status by Age
- `B15002` — Sex by Educational Attainment
- `B19013` — Median Household Income

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Notes

- The app caches metro ACS responses in `localStorage` for 7 days.
- The Census API is queried directly from the browser. For light usage, the public endpoint normally works without an API key.
- The score is a market-position model, not a measure of personal worth.
