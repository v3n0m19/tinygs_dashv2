const axios = require('axios');
const Packet = require('../models/Packet');

const fetchPacketsFromTinyGS = async () => {
    try {
        const response = await axios.get("https://api.tinygs.com/v2/packets?station=ROXX_LoRa@731332067");
        const packets = response.data.packets;

        if (!packets || packets.length === 0) {
            console.log('No new packets found.');
            return { noOfPackets: 0, newPackets: [] };
        }

        const latestPacket = await Packet.findOne().sort({ serverTime: -1 }).lean().select('serverTime');
        const latestTimestamp = latestPacket ? latestPacket.serverTime : 0;

        const newPackets = [];

        for (const packet of packets) {
            if (packet.serverTime > latestTimestamp) {
                newPackets.push(packet);
            } else {
                break;
            }
        }

        // Return the result
        return { noOfPackets: newPackets.length, newPackets };

    } catch (error) {
        console.error('Failed to fetch packets:', error.message);
        return { noOfPackets: 0, newPackets: [], error: error.message };
    }
};

module.exports = fetchPacketsFromTinyGS;
