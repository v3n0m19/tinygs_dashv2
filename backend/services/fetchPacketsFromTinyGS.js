// backend/services/fetchPacketsFromTinyGS.js
const axios = require('axios');
const Packet = require('../models/Packet');

const BATCH_SIZE = 30; // Adjust batch size as needed

const fetchPacketsFromTinyGS = async () => {
    try {
        const response = await axios.get(`${process.env.TINYGS_API}`);
        const packets = response.data.packets;

        if (!packets || packets.length === 0) {
            console.log('No new packets found.');
            return { newPackets: [] };
        }

        const newPackets = [];
        const packetBatches = [];

        // Split packets into batches
        for (let i = 0; i < packets.length; i += BATCH_SIZE) {
            packetBatches.push(packets.slice(i, i + BATCH_SIZE));
        }

        // Process each batch
        for (const batch of packetBatches) {
            const checks = batch.map(async (packet) => {
                const { parsed, ...packetData } = packet;

                // Use findOne with projection to optimize query
                const existingPacket = await Packet.findOne({ id: packetData.id }).lean().select('_id');

                if (!existingPacket) {
                    newPackets.push(packetData);
                    console.log(`Packet ${packetData.id} is new and will be returned.`);
                } else {
                    console.log(`Packet ${packetData.id} already exists and will be skipped.`);
                }
            });

            // Run all checks concurrently
            await Promise.all(checks);
        }

        return { newPackets };

    } catch (error) {
        console.error('Failed to fetch packets:', error.message);
        return { newPackets: [], error: error.message };
    }
};

module.exports = fetchPacketsFromTinyGS;
