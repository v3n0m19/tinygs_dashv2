const express = require('express');
const router = express.Router();

const fetchStatistics = require('../services/statisticsServices/fetchStatistics');
const updateStatisticsAll = require('../services/statisticsServices/updateStatisticsAll');

router.get('/fetch-statistics', async (req, res) => {
  try {
    const statistics = await fetchStatistics(4); 
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/update-statistics', async (req, res) => {
  try {
    await updateStatisticsAll();
    res.status(200).json({message:'Statistics updated successfully.'});
  } catch (error) {
    res.status(500).json({message:'Error updating statistics.'});
  }
});

module.exports = router;
