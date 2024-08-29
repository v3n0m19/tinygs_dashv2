const express = require('express');
const router = express.Router();

const fetchPacketsTinyGS = require('../services/packetServices/fetchPacketsTinyGS');
const fetchPacketsAll = require('../services/packetServices/fetchPacketsAll');
const fetchPacketsSatellite = require('../services/packetServices/fetchPacketsSatellite');
const storePackets = require('../services/packetServices/storePackets');


router.get('/fetch-packets-tinygs', async (req, res) => {
  const result = await fetchPacketsTinyGS();
  res.json(result);
});

router.post('/store-packets-db', async (req, res) => {
  try {
    const { packets } = req.body;
    const result = await storePackets(packets);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/fetch-packets', async (req, res) => {
  try {
    const packets = await fetchPacketsAll();
    res.json(packets);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/fetch-packet', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Satellite name is required.' });
  }
  try {
    const packets = await fetchPacketsSatellite(name);
    if (!packets) {
      return res.status(404).json({ message: 'Packets not found' });
    }
    res.json(packets);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
