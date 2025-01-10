const mongoose = require("mongoose");

const youtubeContentSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true, // YouTube video ID
  },
  videoUrl: {
    type: String,
    required: true, // Full URL to the YouTube video
  },
  transcript: {
    type: String, // The transcript text for the video (optional)
    default: "",
  },
  summary: {
    type: String, // The summary of the YouTube video (optional)
    default: "",
  },
});

const YouTubeContent = mongoose.model("YouTubeContent", youtubeContentSchema);

module.exports = YouTubeContent;
