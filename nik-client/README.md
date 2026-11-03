# nik-client

Expo (SDK 58) + NativeWind client for the NIK Health API.

## Features

- Onboarding, sign-in / sign-up, account recovery
- Home with tips
- Investigations CRUD + activities
- Pulse test with **two heart-rate sources only**:
  1. **Watch simulator** — on-device fake BPM for testing
  2. **Connect Apple Watch** — live BPM via WatchConnectivity + NIK Watch app
- History, journals, settings

## Setup (API + Expo Go / simulator)

```bash
pnpm install
pnpm expo start -c
```

Run `nik-server` on port `8888`. Metro proxies `/api` → the server on `:8081` by default.

## Real Apple Watch (iOS development build)

Live Watch HR does **not** work in Expo Go. Use a dev client:

```bash
pnpm install
npx expo install expo-dev-client
pnpm prebuild:ios
node scripts/copy-watch-app.mjs
# Xcode: add Watch App target "NIKWatchApp", add ios/NIKWatchApp/*.swift, enable HealthKit
pnpm ios:build
```

On Watch: open **NIK** → allow Health → **Start**.  
On iPhone: New test → **Connect Apple Watch** → wait for BPM → start test.

Details: `modules/nik-watch-hr/README.md`.

## API

Calls go through `src/api/*` → `{apiBaseUrl}/api/v1/...` with Bearer tokens.
