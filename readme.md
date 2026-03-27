# Gallery OCR

Search your phone's gallery by text inside images. Powered by on-device ML Kit OCR — nothing leaves your device.

## What it does

- Scans your entire photo gallery and extracts text from every image
- Search any word or phrase to instantly find matching images
- Tap any result to see the full image and all extracted text
- Copy or share extracted text directly
- Sort results by newest, oldest, or most text
- Filter by date range
- Auto-detects new photos on every app open — no manual re-index needed

## Tech stack

- React Native + Expo
- ML Kit OCR (on-device, no internet needed)
- SQLite FTS5 (full-text search, sub-millisecond queries)
- EAS Build (cloud APK builds)

---

## Run locally

### Prerequisites

- Node.js 18+
- Expo CLI
- EAS CLI
- Android phone OR Android emulator
- Expo account (free) at expo.dev

### 1. Clone the repo
```bash
git clone https://github.com/aditya-kannur/gallery-ocr.git
cd gallery-ocr
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Expo and EAS CLI globally
```bash
npm install -g expo-cli eas-cli
```

### 4. Log in to Expo
```bash
eas login
```

### 5. Build the development APK

This step builds a custom APK that includes all native modules (ML Kit OCR, SQLite etc).
Runs on Expo's cloud servers — takes 5-10 minutes.
```bash
eas build --platform android --profile development
```

When done, download the APK from the link provided and install it on your Android phone.
You may need to allow "Install from unknown sources" in your Android settings.

### 6. Start the dev server

Connect your phone and PC to the same WiFi network, then run:
```bash
npx expo start --dev-client
```

If on different networks, use tunnel mode:
```bash
npx expo start --dev-client --tunnel
```

### 7. Open the app

Open the installed app on your phone and scan the QR code from the terminal.
Grant gallery permissions when prompted — indexing starts automatically.

---

## Build a standalone APK

To build a standalone APK that works without Expo dev client:
```bash
eas build --platform android --profile preview
```

Download and install the APK when the build finishes.

---

## Project structure
```
gallery-ocr/
├── App.tsx                          # Entry point, tab navigation
├── app/
│   ├── lib/
│   │   ├── database.ts              # SQLite FTS5 setup and queries
│   │   └── ocr.ts                   # ML Kit OCR + gallery indexer
│   └── components/
│       ├── ImageGrid.tsx            # Search results grid
│       ├── ImageViewer.tsx          # Full image + extracted text modal
│       ├── SearchHistory.tsx        # Recent searches
│       ├── EmptyState.tsx           # Empty state screens
│       ├── SortFilterBar.tsx        # Sort and date filter controls
│       ├── SettingsScreen.tsx       # Index stats and re-index
│       ├── ErrorBoundary.tsx        # Catches and displays crashes
│       └── Toast.tsx                # Copy/share feedback
├── assets/                          # App icon and splash screen
├── app.json                         # Expo config
└── eas.json                         # EAS build profiles
```

---

## Notes

- First index run takes time depending on gallery size — leave the app open
- Only images taken after the last index run are processed on subsequent opens
- All data is stored locally on device — no cloud, no server
- Re-index option available in Settings if needed