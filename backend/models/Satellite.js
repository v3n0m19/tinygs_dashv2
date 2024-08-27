const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  mode: { type: String, required: true },
  freq: { type: Number, required: true },
  bw: { type: Number, required: true },
  sf: { type: Number, required: true },
  cr: { type: Number, required: true },
  sw: { type: Number, required: true },
  pwr: { type: Number, required: true },
  cl: { type: Number, required: true },
  pl: { type: Number, required: true },
  gain: { type: Number, required: true },
  crc: { type: Boolean, required: true },
  fldro: { type: Number, required: true },
  sat: { type: String, required: true },
  NORAD: { type: Number, required: true },
  filter: { type: [Number], default: [] }
});

const satelliteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  configurations: [configurationSchema],
  noOfPackets: { type: Number, default: 0 },
  image: { type: String, default: '' },  
  tle: { type: [String], default: [] } 
});

const Satellite = mongoose.model('Satellite', satelliteSchema);

module.exports = Satellite;
