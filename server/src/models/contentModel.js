const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentType: { type: String, enum: ['video', 'pdf'], required: true },
    originalFileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL if stored in S3/Cloudinary
    transcript: { type: String }, // Processed transcript
    summary: { type: String }, // Summarized text
    translation: { type: String }, // Translated text
    language: { type: String, default: 'en' },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  });
  
  module.exports = mongoose.model('Content', contentSchema);
  