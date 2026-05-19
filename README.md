<<<<<<< HEAD
# Final-Year-Project-
Trip Wise- AI Assissted Mobile Application
=======
# Trip Wise Pakistan 🇵🇰

A cross-platform travel application for Pakistan featuring AI itinerary planning, community feeds, and extensive spot data.

## Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion
- **Navigation:** React Router (HashRouter for PWA compatibility)
- **Data:** Local Storage + Mock Simulated API
- **Mobile:** Capacitor (Android & iOS)

## Quick Start

1. Install dependencies:
   ```bash
   npm install react react-dom react-router-dom framer-motion @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   ```

2. Run local development server:
   ```bash
   npm start # or whatever your bundler command is (e.g. vite)
   ```

## Native Builds (Capacitor)

### 1. Setup
Initialize Capacitor in the project root:
```bash
npx cap init "Trip Wise Pakistan" com.tripwise.pakistan
```

### 2. Build Web Assets
Ensure you build the React app first (output to `dist` or `build` folder):
```bash
npm run build
```

### 3. Add Platforms
```bash
npx cap add android
npx cap add ios
```

### 4. Sync
Copy web assets to native directories:
```bash
npx cap sync
```

### 5. Native Configuration
- **Android:** Open `android/app/src/main/AndroidManifest.xml` to add Permissions (Camera, Geolocation).
- **Google Maps:**
  - Get an API Key from Google Cloud Console.
  - Android: Add to `AndroidManifest.xml` meta-data `com.google.android.geo.API_KEY`.
  - iOS: Add `GMSServices.provideAPIKey("AIzaSyB0-ohQNSxK_Els-U8i9m7hrpHqG3y08VI")` in `AppDelegate.swift`.

### 6. Packaging & Signing

#### Android (Play Store)
1. Open Android Studio: `npx cap open android`
2. Go to **Build > Generate Signed Bundle / APK**.
3. Create a new KeyStore (keep it safe!).
4. Build the AAB (Android App Bundle).
5. Upload AAB to Google Play Console.

#### iOS (App Store)
1. Open Xcode: `npx cap open ios`
2. Select your generic iOS Device (or real device).
3. Go to **Signing & Capabilities** tab.
4. Select your Apple Developer Team.
5. Product > Archive.
6. Use "Distribute App" to upload to TestFlight / App Store Connect.

## Mock AI Note
All AI features in `/lib/mockApi.ts` are simulated. To use real AI:
1. Replace `askAIChat` with a fetch call to OpenAI/Gemini API.
2. Store API keys in `.env` (never commit them).
>>>>>>> d0f6128 (Initial commit)
