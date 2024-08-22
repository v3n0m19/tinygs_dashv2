const Satellite = require('../models/Satellite');

const fetchSatellite = async (name) => {
  try {
    const satellite = await Satellite.findOne({ name: name });

    if (!satellite) {
      return null; // Return null if no satellite is found
    }

    return satellite; // Return the satellite document
  } catch (error) {
    console.error('Failed to fetch satellite by name:', error.message);
    throw new Error('Internal Server Error'); // Throw a generic error for the API layer
  }
};

module.exports = fetchSatellite;
