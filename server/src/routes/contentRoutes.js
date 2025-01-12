const express = require("express");
const { downloadAndUploadAudio } = require("../controllers/contentController");

const router = express.Router();

router.post("/upload", downloadAndUploadAudio);

module.exports = router;
