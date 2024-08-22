// services/statisticsService.js

const Statistics = require('../models/Statistics');

const getStatisticsForLastMonths = async (months = 4) => {
  try {
    const dateThreshold = new Date(new Date().setMonth(new Date().getMonth() - months));
    
    const data = await Statistics.find({
      day: {
        $gte: dateThreshold
      }
    });

    // Transform data to the format with date and packets fields
    const formattedData = data.map(stat => ({
      date: new Date(stat.day).toISOString().split('T')[0], 
      count: stat.nFrames
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to fetch statistics data');
  }
};

module.exports =getStatisticsForLastMonths;
