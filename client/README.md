# Learnoverse - Client (React Native Expo App)

This is the React Native app for the internship assignment.  
It lists videos from the backend and plays them inside the app using a YouTube player.

---

## Requirements

- Node.js v16+
- Expo CLI (install with `npm install -g expo-cli` or use `npx expo`)
- Backend server must be running and reachable

---

## Setup

1. Clone this repo and open the `client/` folder.

2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the SERVER_URL in screens/VideoListScreen.js:
   const SERVER_URL = "http://<your-server-ip>:4000";
   If using physical device → use your laptop’s LAN IP (e.g., http://192.168.31.xxx:4000).
   If using Android emulator → http://10.0.2.2:4000.
   If using iOS simulator → http://localhost:4000.

4. Start the app:
   
   npx expo start
   
6. Scan the QR code:
   
   Android → Expo Go app
   
   iOS → Camera app
