const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String }], // Array of possible answers
        correctAnswer: { type: String, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Quiz', quizSchema);
  