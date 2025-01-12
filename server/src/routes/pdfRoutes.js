const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  uploadPdf,
  processPdf,
  summarizePdf,
} = require("../controllers/pdfController");

router.post("/upload", upload.single("pdf"), uploadPdf);
router.post("/process", processPdf);
router.post("/summarize", summarizePdf);

module.exports = router;
