const Packet = require('../../models/Packet');

const fetchPacketsSatellite = async (name) => {
  try {
    const packets = await Packet.find({ satellite: name });

    if (!packets || packets.length === 0){
      return null; 
    }

    return packets; 
  } catch (error) {
    console.error('Failed to fetch packets:', error.message);
    throw new Error('Internal Server Error'); // Throw a generic error for the API layer
  }
};

module.exports = fetchPacketsSatellite;
