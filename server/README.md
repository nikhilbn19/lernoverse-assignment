# Learnoverse - Server

This is the backend server for the internship assignment.  
It fetches `videoId`s from MongoDB, enriches them with metadata using the YouTube Data API, and serves them to the React Native client.

## Requirements

- Node.js v16+
- MongoDB Atlas (with a `youtubeApp` database and `videos` collection)
- YouTube Data API key

## Setup

1. Clone this repo and open the `server/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the server/ folder and add the following:
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
4. Start the server:
   npm start
5. Test the server:
   http://localhost:4000/videos

## Endpoints

    GET /videos → Returns enriched video list (with title, channel, thumbnails, duration).
    GET / → Health check (returns "YouTube-list server running").
