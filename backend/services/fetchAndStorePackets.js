// backend/services/fetchAndStorePackets.js
const axios = require('axios');
const Packet = require('../models/Packet');

const fetchAndStorePackets = async () => {
    let noOfNewPackets = 0;

    try {
        const response = await axios.get(`${process.env.TINYGS_API}`);
        const packets = response.data.packets;

        if (!packets || packets.length === 0) {
            console.log('No new packets to store.');
            return { newPacketsStored: false, noOfNewPackets: 0 };
        }

        for (const packet of packets) {
            // Exclude the 'parsed' field
            const { parsed, ...packetData } = packet;

            // Check if the packet already exists in the database
            const existingPacket = await Packet.findOne({ id: packetData.id });
            if (!existingPacket) {
                // Save the new packet to the database
                const newPacket = new Packet(packetData);
                await newPacket.save();
                noOfNewPackets += 1;
                console.log(`Packet ${packetData.id} saved.`);
            } else {
                console.log(`Packet ${packetData.id} already exists.`);
            }
        }

        return { newPacketsStored: noOfNewPackets > 0, noOfNewPackets };

    } catch (error) {
        console.error('Failed to fetch and store packets:', error.message);
        return { newPacketsStored: false, noOfNewPackets: 0 };
    }
};

module.exports = fetchAndStorePackets;
