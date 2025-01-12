const downloadAudio = require("../utils/downloadAudio");

const uploadAudioCloudnary = require("../utils/uploadAudioCloudnary");

const downloadAndUploadAudio = async (req, res, next) => {
  const { videoUrl } = req.body;
  console.log(videoUrl);
  try {
    const audioPath = await downloadAudio(videoUrl, "./audio.mp3");
    console.log(audioPath);
    const audioUrl = await uploadAudioCloudnary(audioPath);
    console.log(audioUrl);
    res.status(200).json({
      message: "Audio uploaded successfully",
      audioUrl,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { downloadAndUploadAudio };
