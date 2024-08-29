const axios = require('axios');
const Satellite = require('../../models/Satellite');
const fetchSatellitesAll = async ()=>{
    try {
        const satellites = await Satellite.find({});
        return satellites;
      } catch (error) {
        throw new Error('Error fetching Satellites: ' + err.message);
      }
    
};
module.exports = fetchSatellitesAll;
