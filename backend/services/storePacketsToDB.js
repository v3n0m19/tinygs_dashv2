const Packet = require('../models/Packet');

const storePacketsToDB = async (packets) => {
    let noOfNewPackets = 0;

    try {
        if (!packets || packets.length === 0) {
            console.log('No packets to store.');
            return { newPacketsStored: false, noOfNewPackets: 0 };
        }

        for (const packet of packets) {
            const newPacket = new Packet(packet);
            await newPacket.save();
            noOfNewPackets += 1;
            console.log(`Packet ${packet.id} saved.`);
        }

        return { newPacketsStored: noOfNewPackets > 0, noOfNewPackets };

    } catch (error) {
        console.error('Failed to store packets:', error.message);
        return { newPacketsStored: false, noOfNewPackets: 0, error: error.message };
    }
};

module.exports = storePacketsToDB;
