const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User schema
    required: true,
  },

  contentType: {
    type: String,
    enum: ["pdf", "youtube"], // The type of content (either pdf or youtube)
    required: true,
  },
  status: {
    type: String,
    enum: ["queued", "processing", "processed"], // Status of the content processing
    default: "queued", // Default status when new content is added
  },
  contentDetails: {
    type: mongoose.Schema.Types.ObjectId, // Reference to either PDFContent or YouTubeContent
    refPath: "contentType", // Dynamically determines the reference based on contentType
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
