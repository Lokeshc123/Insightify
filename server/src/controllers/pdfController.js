const cloudinary = require("../config/cloudnary");
const PDFContent = require("../models/pdfContentSchema");
const ContentModel = require("../models/contentModel");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const CustomError = require("../utils/customError");
const { text } = require("body-parser");
const model = require("../config/gemini");

const uploadPdf = async (req, res, next) => {
  try {
    const pdfPath = req.file.path;

    const upload_result = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      folder: "pdfs",
    });

    const pdfContent = new PDFContent({
      fileUrl: upload_result.secure_url,
      pageCount: 0,
    });

    await pdfContent.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdfContent,
    });
  } catch (err) {
    next(err);
  }
};

const processPdf = async (req, res, next) => {
  try {
    const { pdfUrl } = req.body;
    console.log(`Starting PDF processing for URL: ${pdfUrl}`);

    const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
    console.log(`PDF fetched successfully from URL: ${pdfUrl}`);

    const pdfBuffer = Buffer.from(response.data);
    const pdfData = await pdfParse(pdfBuffer);

    const pdf_content = await PDFContent.findOne({ fileUrl: pdfUrl });

    if (!pdf_content) {
      return next(new CustomError(404, "Content not found"));
    }

    pdf_content.transcript = pdfData.text;

    await pdf_content.save();

    res.status(200).json({
      message: "PDF processed successfully",
      text: pdfData.text,
    });
  } catch (err) {
    console.error(`Error processing PDF from URL`, err.message);
    next(err);
  }
};

const summarizePdf = async (req, res, next) => {
  try {
    const { pdfUrl } = req.body;

    const pdf_content = await PDFContent.findOne({ fileUrl: pdfUrl });

    if (!pdf_content) {
      return next(new CustomError(404, "Content not found"));
    }

    const text = pdf_content.transcript;
    const prompt = "Summarize the text " + text;

    const result = await model.generateContent(prompt);

    pdf_content.summary = result.response.text();

    res.status(200).json({
      message: "PDF summarized successfully",
      summary: result.response.text(),
    });
  } catch (err) {
    console.error(`Error summarizing PDF from URL`, err.message);
    next(err);
  }
};
module.exports = { uploadPdf, processPdf, summarizePdf };
