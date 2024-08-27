const Satellite = require('../models/Satellite');

const fetchSatellite = async (name) => {
  try {
    const satellite = await Satellite.findOne({ name: name });

    if (!satellite) {
      return null; 
    }

    return satellite; 
  } catch (error) {
    console.error('Failed to fetch satellite by name:', error.message);
    throw new Error('Internal Server Error');
  }
};

module.exports = fetchSatellite;
