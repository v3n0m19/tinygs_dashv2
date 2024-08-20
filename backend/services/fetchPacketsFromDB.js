
const Packet = require('../models/Packet');

const getPackets = async () => {
  try {
    const packets = await Packet.find({});
    return packets;
  } catch (err) {
    throw new Error('Error fetching packets: ' + err.message);
  }
};

module.exports = getPackets;