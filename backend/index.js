const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB().then(() => {
  console.log('MongoDB connection successful');
}).catch(error => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1);
});

// Route handlers
const satelliteRoutes = require('./routes/satelliteRoutes');
const packetRoutes = require('./routes/packetRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

app.use('/api', satelliteRoutes);
app.use('/api', packetRoutes);
app.use('/api', statisticsRoutes);

// Root route
app.get('/api/', (req, res) => res.send("tinyGS-dash API"));

// Proxy image route
app.get('/api/proxy-image', async (req, res) => {
  try {
    const response = await axios.get('https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74218/world.200412.3x5400x2700.jpg', {
      responseType: 'stream'
    });
    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});

// Start the server
const PORT = process.env.PORT || 5455;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
