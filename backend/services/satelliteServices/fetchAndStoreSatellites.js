const axios = require('axios');
const Satellite = require('../../models/Satellite');
const Packet = require('../../models/Packet');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAndStoreSatellites = async () => {
    try {
        const response = await axios.get('https://api.tinygs.com/v1/satellites/?status=Supported');
        const satellites = response.data;

        const satelliteData = [];

        for (const satellite of satellites) {
            console.log(`Processing satellite: ${satellite.name}`);
            
            try {
                const additionalData = await fetchWithRetry(`https://api.tinygs.com/v1/satellite/${satellite.name}`);
                const { images, tle } = additionalData;

                console.log(`Fetched additional data for satellite: ${satellite.name}`);

                const configurations = satellite.configurations.map(config => ({
                    mode: config.mode || '',
                    freq: config.freq || 0,
                    bw: config.bw || 0,
                    sf: config.sf || 0,
                    cr: config.cr || 0,
                    sw: config.sw || 0,
                    pwr: config.pwr || 0,
                    cl: config.cl || 0,
                    pl: config.pl || 0,
                    gain: config.gain || 0,
                    crc: config.crc || false,
                    fldro: config.fldro || 0,
                    sat: config.sat || '',
                    NORAD: config.NORAD || 0,
                    filter: config.filter || []
                }));

                const packet_no = await Packet.countDocuments({ satellite: satellite.name });
                console.log(`Packet count for satellite ${satellite.name}: ${packet_no}`);

                const firstImage = images && images.length > 0 ? images[0] : '';
                const tleData = tle || [];

                satelliteData.push({
                    updateOne: {
                        filter: { name: satellite.name },
                        update: {
                            displayName: satellite.displayName,
                            configurations: configurations,
                            noOfPackets: packet_no,
                            image: firstImage,
                            tle: tleData
                        },
                        upsert: true
                    }
                });

                console.log(`Stored satellite data: ${satellite.name}`);

                await delay(5000);
            } catch (error) {
                console.error(`Error fetching or storing data for ${satellite.name}:`, error);
            }
        }

        if (satelliteData.length > 0) {
            await Satellite.bulkWrite(satelliteData);
            console.log('All satellite data successfully fetched and stored.');
        }

        return { success: true, message: 'Satellite data successfully fetched and stored.' };
    } catch (error) {
        console.error('Error fetching and storing satellite data:', error);
        return { success: false, error: error.message };
    }
};

const fetchWithRetry = async (url, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429 && attempt < retries) {
                // If rate-limited, wait before retrying
                const retryAfter = error.response.headers['retry-after'] ? parseInt(error.response.headers['retry-after'], 10) * 1000 : 1000;
                console.warn(`Rate limited for ${url}. Retrying after ${retryAfter} ms... (Attempt ${attempt} of ${retries})`);
                await delay(retryAfter);
            } else {
                console.error(`Failed to fetch data from ${url} on attempt ${attempt}:`, error);
                throw error;
            }
        }
    }
    throw new Error(`Failed to fetch data from ${url} after ${retries} attempts`);
};

module.exports = fetchAndStoreSatellites;
