const Satellite = require('../../models/Satellite');
const Packet = require('../../models/Packet');

const updateSatellitesAll = async () => {
    try {
        const packetCounts = await Packet.aggregate([
            {
                $group: {
                    _id: "$satellite",
                    count: { $sum: 1 }
                }
            }
        ]);

        const bulkOperations = packetCounts.map((packetCount) => ({
            updateOne: {
                filter: { name: packetCount._id, noOfPackets: { $ne: packetCount.count } },
                update: { noOfPackets: packetCount.count }
            }
        }));

        await Satellite.bulkWrite(bulkOperations);

        return { success: true, message: 'Satellite packet counts successfully updated.' };
    } catch (error) {
        console.error('Error updating satellite packet counts:', error);
        return { success: false, error: error.message };
    }
};

module.exports = updateSatellitesAll;
