const express = require('express');
const connectDB = require('./config/db');
const fetchAndStorePackets = require('./services/fetchAndStorePackets');
const getPackets  = require('./services/fetchPacketsFromDB');

const app = express();

connectDB().then(() => {
    console.log('MongoDB connection successful');
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});

app.get('/api/', (req,res) => res.send("tinyGS-dash API"))
app.get('/api/store-packets', async (req, res) => {
    const result = await fetchAndStorePackets();
    res.json(result);
});
app.get('/api/fetch-packets', async (req, res) => {
    try {
      const packets = await getPackets();
      res.json(packets);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app; // Export the app for Vercel
