const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  day: { type: Number, unique: true, index: true }, // Unix timestamp for the day
  frames: [{
    satellite: String,
    satPos: {
      lat: Number,
      lng: Number,
      alt: Number,
    },
  }],
  nFrames: Number,
  telemetryPkt: Number,
});
statisticsSchema.index({ day: 1 });

module.exports = mongoose.model('Statistics', statisticsSchema);
