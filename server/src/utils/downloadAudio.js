const ytdl = require("ytdl-core-discord");

async function downloadAudio(videoUrl) {
  try {
    return await ytdl(videoUrl, { filter: "audioonly" });
  } catch (error) {
    console.error(error);
  }
}

module.exports = downloadAudio;
