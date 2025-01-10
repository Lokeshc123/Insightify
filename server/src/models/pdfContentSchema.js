const mongoose = require("mongoose");

const pdfContentSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true, // The URL where the PDF is stored
  },
  pageCount: {
    type: Number,
    required: true, // The number of pages in the PDF
  },
  transcript: {
    type: String, // The transcript text from the PDF (optional)
    default: "",
  },
  summary: {
    type: String, // The summary of the PDF content (optional)
    default: "",
  },
});

const PDFContent = mongoose.model("PDFContent", pdfContentSchema);

module.exports = PDFContent;
