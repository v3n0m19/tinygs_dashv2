const axios = require('axios');
const Packet = require('../models/Packet');

const fetchPacketsFromTinyGS = async () => {
    try {
        const response = await axios.get('https://api.tinygs.com/v2/packets?station=ROXX_LoRa@731332067');
        const packets = response.data.packets;

        if (!packets || packets.length === 0) {
            console.log('No new packets found.');
            return { newPackets: [] };
        }

        const newPackets = [];

        for (const packet of packets) {
            const { parsed, ...packetData } = packet;

            // Check if the packet already exists in the database
            const existingPacket = await Packet.findOne({ id: packetData.id });
            if (!existingPacket) {
                newPackets.push(packetData);
                console.log(`Packet ${packetData.id} is new and will be returned.`);
            } else {
                console.log(`Packet ${packetData.id} already exists and will be skipped.`);
            }
        }

        return { newPackets };

    } catch (error) {
        console.error('Failed to fetch packets:', error.message);
        return { newPackets: [], error: error.message };
    }
};

module.exports = fetchPacketsFromTinyGS;
