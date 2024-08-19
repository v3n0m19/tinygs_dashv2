const express = require('express');
const connectDB = require('./config/db');
const fetchAndStorePackets = require('./services/fetchAndStorePackets');

const app = express();
app.get('/', (req,res) => res.send("tinyGS-dash API"))
app.get('/fetch-packets', async (req, res) => {
    await connectDB();
    const result = await fetchAndStorePackets();
    res.json(result);
});

if (process.env.NODE_ENV !== 'production') {
    // Local development
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app; // Export the app for Vercel
