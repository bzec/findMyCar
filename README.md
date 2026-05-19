# Find My Car

A progressive web app (PWA) that helps you locate your parked car and review
your parking history. Mark where you parked, follow a live route back to your
car on the map, time how long you have been parked, and attach a photo of the
spot.

## Technologies

- Angular 20 (standalone components)
- Ionic 8
- Capacitor 7 plugins (Geolocation, Camera) for web
- Leaflet + OpenStreetMap for the map
- Ionic Storage for local persistence

Runs on Node.js 22 (see `.nvmrc`).

## Getting started

```bash
nvm use          # Node 22
npm install
npm start        # dev server on http://localhost:4200
```

Other scripts:

```bash
npm run build    # production build (PWA, service worker)
npm run lint     # ESLint
npm test         # unit tests (Vitest)
```

## Copyright

This source code belongs to me. It may be consulted but not used for commercial
or personal purposes.

Maps powered by OpenStreetMap: https://www.openstreetmap.org/copyright
