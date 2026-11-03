# nik-watch-hr

Real Apple Watch heart-rate bridge for NIK Expo client.

## Architecture

```
Apple Watch (NIKWatchApp)
  → HealthKit HKWorkoutSession (live BPM)
  → WatchConnectivity { bpm, msg }
iPhone (NikWatchHrSession)
  → Expo module events onHeartRate / onStatus
  → React Native Connect Apple Watch → Monitor
```

## Requirements

- Physical **iPhone + paired Apple Watch**
- **Development / production iOS build** (not Expo Go)
- Mac with Xcode
- Apple Developer team (HealthKit + Watch entitlements)

## Build

```bash
cd nik-client
pnpm install
npx expo install expo-dev-client
npx expo prebuild --platform ios
# Open ios/*.xcworkspace in Xcode
# File → New → Target → Watch App → name NIKWatchApp
# Add sources from ios/NIKWatchApp/*.swift into the Watch target
# Enable HealthKit on iPhone + Watch targets
npx expo run:ios --device
```

On the Watch: open **NIK** → allow Health → tap **Start**.  
On the phone: **Connect Apple Watch** → wait for BPM → start test.
