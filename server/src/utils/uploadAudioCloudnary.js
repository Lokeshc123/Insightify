const cloudinary = require("../config/cloudnary");

const uploadAudioCloudnary = async (audioPath) => {
  try {
    const audio = await cloudinary.uploader.upload(audioPath, {
      resource_type: "video",
      format: "mp3",
    });
    return audio.secure_url;
  } catch (error) {
    console.error(error);
  }
};

module.exports = uploadAudioCloudnary;
