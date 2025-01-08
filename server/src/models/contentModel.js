const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'youtube'],
    required: true,
  },
  contentUrl: {
    type: String,
    required: true,  // For PDFs: path to the file, For YouTube: YouTube video ID or URL
  },
  transcript: {
    type: String, // This will store the transcribed text if applicable
    default: '',
  },
  translation: {
    type: String, // Store the translated content if applicable
    default: '',
  },
  summary: {
    type: String, // Store the summarized content
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
