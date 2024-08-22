const axios = require('axios');
const Satellite = require('../models/Satellite');
const Packet = require('../models/Packet');

const fetchAndStoreSatellites = async () => {
    try {
        const response = await axios.get('https://api.tinygs.com/v1/satellites/?status=Supported');
        const satellites = response.data;
    
        const savePromises = satellites.map(async (satellite) => {
          // Ensure all required fields are present and set defaults if necessary
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
          
          const packet_no = await Packet.countDocuments({ satellite: satellite.name })

          return Satellite.updateOne(
            { name: satellite.name },
            { 
              displayName: satellite.displayName,
              configurations: configurations,
              noOfPackets: packet_no
            },
            { upsert: true }
          );
        });
    
        await Promise.all(savePromises);
        return { success: true, message: 'Satellite data successfully fetched and stored.' };
    } catch (error) {
        console.error('Error fetching and storing satellite data:', error);
        return { success: false, error: error.message };
    }

};

module.exports = fetchAndStoreSatellites;
