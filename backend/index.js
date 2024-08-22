const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const getPackets  = require('./services/fetchPacketsFromDB');
const fetchPacketsFromTinyGS = require('./services/fetchPacketsFromTinyGS');
const storePacketsToDB = require('./services/storePacketsToDB');
const fetchAndStoreSatellites = require('./services/fetchAndStoreSatellites');
const fetchSatellitesFromDB = require('./services/fetchSatellitesFromDB');
const fetchSatellite = require('./services/fetchSatellite');
const fetchPackets = require('./services/fetchPackets');
const updateStatistics = require('./services/updateStatistics');
const getStatisticsForLastMonths = require('./services/getStatisticsForLastMonths');

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB().then(() => {
    console.log('MongoDB connection successful');
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});

app.get('/api/', (req,res) => res.send("tinyGS-dash API"))
app.get('/api/fetch-statistics', async (req, res) => {
    try {
      const statistics = await getStatisticsForLastMonths(4); 
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.get('/api/update-statistics', async (req, res) => {
    try {
      await updateStatistics();
      res.status(200).send('Statistics updated successfully.');
    } catch (error) {
      res.status(500).send('Error updating statistics.');
    }
  });
app.get('/api/store-sats', async (req, res) => {
    try {
      const result = await fetchAndStoreSatellites();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.get('/api/fetch-packets-tinygs', async (req, res) => {
    const result = await fetchPacketsFromTinyGS();
    res.json(result);
});
app.post('/api/store-packets-db', async (req, res) => {
    try {
      const { packets } = req.body;
      const result = await storePacketsToDB(packets);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.get('/api/fetch-packets', async (req, res) => {
    try {
      const packets = await getPackets();
      res.json(packets);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  app.get('/api/fetch-sats', async (req, res) => {
    try {
      const satellites = await fetchSatellitesFromDB();
      res.json(satellites);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  app.get('/api/fetch-packet', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Satellite name is required.' });
      }
    try {
      const packets = await fetchPackets(name);
  
      if (!packets) {
        return res.status(404).json({ message: 'Packets not found' });
      }
  
      res.json(packets);
    } catch (error) {
      console.error('Error fetching Packets data:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.get('/api/fetch-sat', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Satellite name is required.' });
      }
    try {
      const satellite = await fetchSatellite(name);
  
      if (!satellite) {
        return res.status(404).json({ message: 'Satellite not found' });
      }
  
      res.json(satellite);
    } catch (error) {
      console.error('Error fetching satellite data:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5455;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app; 
