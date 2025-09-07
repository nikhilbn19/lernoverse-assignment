require("dotenv").config();
console.log("ENV CHECK:", process.env.MONGODB_URI, process.env.YOUTUBE_API_KEY);
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}
if (!YOUTUBE_API_KEY) {
  console.error("Missing YOUTUBE_API_KEY in .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const videoSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
  },
  { collection: "videos" }
);

const Video = mongoose.model("Video", videoSchema);

/**
 * Helper: convert ISO 8601 duration to seconds (e.g. PT1H2M30S -> seconds)
 */
function iso8601DurationToSeconds(iso) {
  const regex =
    /P(?:([\d.]+)Y)?(?:([\d.]+)M)?(?:([\d.]+)W)?(?:([\d.]+)D)?(?:T(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?)?/;
  const matches = iso.match(regex);
  if (!matches) return 0;
  const [, years, months, weeks, days, hours, minutes, seconds] = matches.map(
    (v) => (v ? parseFloat(v) : 0)
  );
  return Math.round(
    (years * 365 + months * 30 + weeks * 7 + days) * 24 * 3600 +
      hours * 3600 +
      minutes * 60 +
      seconds
  );
}

app.get("/videos", async (req, res) => {
  try {
    // 1. fetch videoIds from MongoDB
    const docs = await Video.find({}).lean();
    const videoIds = docs.map((d) => d.videoId).filter(Boolean);
    if (videoIds.length === 0) {
      return res.json({ videos: [] });
    }

    // 2. call YouTube API (videos.list) in batches up to 50 (we have 10)
    const idsParam = videoIds.join(",");
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(
      idsParam
    )}&key=${YOUTUBE_API_KEY}`;

    const ytResp = await axios.get(url);
    const items = ytResp.data.items || [];

    // Map youtube data by id
    const metaById = {};
    items.forEach((item) => {
      const id = item.id;
      const snippet = item.snippet || {};
      const contentDetails = item.contentDetails || {};
      metaById[id] = {
        videoId: id,
        title: snippet.title || "",
        channelTitle: snippet.channelTitle || "",
        thumbnails: snippet.thumbnails || {},
        duration: contentDetails.duration || "",
        durationSeconds: iso8601DurationToSeconds(
          contentDetails.duration || ""
        ),
      };
    });

    // Build final list preserving order from MongoDB
    const enriched = videoIds.map(
      (id) => metaById[id] || { videoId: id, title: null }
    );

    res.json({ videos: enriched });
  } catch (err) {
    console.error("Error in /videos:", err.message || err);
    res
      .status(500)
      .json({ error: "Server error", details: err.message || err });
  }
});

app.get("/", (req, res) => {
  res.send("YouTube-list server running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
