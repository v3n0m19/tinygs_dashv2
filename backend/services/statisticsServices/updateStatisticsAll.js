const axios = require('axios');
const Statistics = require('../../models/Statistics');

const updateStatisticsAll = async () => {
  try {
    // Fetch data from TinyGS API
    const response = await axios.get('https://api.tinygs.com/v1/station/ROXX_LoRa@731332067/statistics');
    const statistics = response.data;

    // Batch processing to update or insert documents
    const bulkOps = statistics.map((stat) => ({
      updateOne: {
        filter: { day: stat.day },
        update: { $set: { frames: stat.frames, nFrames: stat.nFrames, telemetryPkt: stat.telemetryPkt } },
        upsert: true, // Insert if the document doesn't exist
      },
    }));

    // Execute bulk write operation
    await Statistics.bulkWrite(bulkOps);
    console.log('Statistics updated successfully.');
  } catch (error) {
    console.error('Error fetching or updating statistics:', error);
  }
};

module.exports = updateStatisticsAll;
