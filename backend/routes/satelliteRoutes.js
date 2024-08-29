const express = require('express');
const router = express.Router();

const fetchAndStoreSatellites = require('../services/satelliteServices/fetchAndStoreSatellites');
const fetchSatellitesAll = require('../services/satelliteServices/fetchSatellitesAll');
const fetchSatellite = require('../services/satelliteServices/fetchSatellite');
const updateSatellitesAll = require('../services/satelliteServices/updateSatellitesAll');

router.get('/store-sats', async (req, res) => {
  try {
    const result = await fetchAndStoreSatellites();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/update-sats', async (req, res) => {
  const result = await updateSatellitesAll();
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.get('/fetch-sat', async (req, res) => {
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/fetch-sats', async (req, res) => {
  try {
    const satellites = await fetchSatellitesAll();
    res.json(satellites);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
