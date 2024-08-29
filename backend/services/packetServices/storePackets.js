const Packet = require('../../models/Packet');

const storePackets = async (packets) => {

    try {
        if (!packets || packets.length === 0) {
            console.log('No packets to store.');
            return { newPacketsStored: false };
        }

        for (const packet of packets) {
            const newPacket = new Packet(packet);
            await newPacket.save();
        }

        return { newPacketsStored: true };

    } catch (error) {
        console.error('Failed to store packets:', error.message);
        return { newPacketsStored: false, error: error.message };
    }
};

module.exports = storePackets;
