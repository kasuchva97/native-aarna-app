# BalaKatha: Stories, Myths & Poems

![React Native](https://img.shields.io/badge/React_Native-0.84-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![PostHog](https://img.shields.io/badge/PostHog-F54E00?style=for-the-badge&logo=posthog&logoColor=white)

## About

**Aarna App** is an interactive educational and storytelling application built for children. Migrated from a React web app to a fully native Android experience, it brings mythological, historical, and moral stories along with poems and fun games — all personalized for each child.

The app features bilingual text (English + Telugu), a built-in text-to-speech narrator, and dynamically personalized story templates that insert the child's and parents' names directly into the narrative.

---

## Features

- **Personalized Storytelling** — Collects the child's name and parents' names on first launch and weaves them into every story dynamically.
- **6 Story Categories** — Mythology, Aarna's Adventures, Moral Stories, History (Ramayana & Mahabharata), Poems, and Fun Zone games.
- **Bilingual TTS Narrator** — "Read to Me" reads each story aloud in Telugu first, then English, using the device's native TTS engine.
- **Interactive Story Viewer** — Full-screen story slider with synchronized illustrations and bilingual text blocks.
- **Poem Viewer** — Dedicated viewer for Telugu and English poems with TTS support.
- **Fun Zone** — In-app WebView-based mini-games and puzzles for kids.
- **Offline Profiles** — Profile data stored locally via AsyncStorage; no account required.
- **Analytics** — PostHog autocapture for screens and touch events with manual event tracking.
- **Crash Reporting** — Firebase Crashlytics for real-time crash monitoring in production.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.84 (New Architecture) |
| Language | TypeScript + JavaScript |
| Navigation | React Navigation v7 (Stack) |
| Backend | Supabase (`@supabase/supabase-js`) |
| Local Storage | `@react-native-async-storage/async-storage` |
| Images | `@d11/react-native-fast-image` |
| Text-to-Speech | `react-native-tts` |
| Gradients | `react-native-linear-gradient` |
| Analytics | PostHog (`posthog-react-native` v4) |
| Crash Reporting | Firebase Crashlytics (`@react-native-firebase/crashlytics` v24) |
| Environment Config | `react-native-config` |
| Device Info | `react-native-device-info` |

---

## Getting Started

### Prerequisites

- Node >= 22.11.0
- JDK 17
- Android Studio with Android SDK
- A physical Android device or emulator (API 24+)

Refer to the [official React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment) for full instructions.

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-username/AarnaAppNative.git
   cd AarnaAppNative
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:
   ```env
   POSTHOG_API_KEY=your_posthog_api_key
   POSTHOG_HOST=https://us.i.posthog.com
   ```

4. **Add Firebase config**

   Place your `google-services.json` from the Firebase Console into `android/app/google-services.json`.

### Running on Android

**Connect a physical device** (recommended for Crashlytics and TTS):
- Enable Developer Options → USB Debugging on your phone
- Connect via USB and accept the debugging prompt

**Verify device is detected:**
```sh
adb devices
```

**Start Metro and build:**
```sh
# Terminal 1
npm start

# Terminal 2
npm run android
```

First build takes 3–5 minutes. Subsequent builds are faster.

> **TTS Note:** For Telugu TTS to work correctly, install the Telugu language pack on your device: Settings → General Management → Language → Text-to-Speech → install Telugu voices.

---

## Project Structure

```
AarnaAppNative/
├── android/                  # Native Android project
│   └── app/
│       └── google-services.json   # Firebase config (not committed)
├── src/
│   ├── components/
│   │   └── ui/               # Reusable UI components (Button, Card)
│   ├── navigation/
│   │   └── AppNavigator.js   # Stack navigator with all screens
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── ProfileScreen.js  # First-launch name collection
│   │   ├── HomeScreen.js     # Category grid + Debug entry
│   │   ├── Grids.js          # Category grid screens
│   │   ├── StoriesList.js
│   │   ├── StoryViewer.js    # Bilingual story + TTS
│   │   ├── PoemsList.js
│   │   ├── PoemViewer.js
│   │   ├── GameViewer.js     # WebView-based games
│   │   └── DebugScreen.js    # Analytics & crash testing
│   ├── lib/
│   │   └── supabaseClient.js # Supabase client initialization
│   └── utils/
│       ├── text.ts           # Text processing helpers
│       └── audio.ts          # TTS helpers
├── App.tsx                   # Root: PostHogProvider + NavigationContainer
├── index.js                  # Entry point: Crashlytics init + AppRegistry
└── .env                      # Environment variables (not committed)
```

---

## Analytics & Crash Reporting

### PostHog
- Initialized in [App.tsx](App.tsx) via `PostHogProvider`
- Autocapture enabled for screen views and touch events
- Manual event tracking available via the `usePostHog()` hook

### Firebase Crashlytics
- Collection enabled at app startup in [index.js](index.js)
- Captures both fatal crashes and non-fatal errors
- Reports upload on next app launch after a crash

### Debug Screen
Navigate to **Home → "🛠️ System Diagnostics"** to access the Debug screen, which lets you:
- Fire a test PostHog event and verify it appears in the PostHog dashboard
- Send a custom Crashlytics log
- Record a non-fatal error to Firebase
- Trigger a native crash (re-open the app to upload the report)

---

## Environment Variables

| Variable | Description |
|---|---|
| `POSTHOG_API_KEY` | PostHog project API key |
| `POSTHOG_HOST` | PostHog ingestion host (default: `https://us.i.posthog.com`) |

Managed via `react-native-config`. Values in `.env` are baked into the native build — restart Metro and rebuild after any changes.

---

## Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request
