const express = require('express');
const connectDB = require('./config/db');
const fetchAndStorePackets = require('./services/fetchAndStorePackets');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.get('/fetch-packets', async (req, res) => {
    const result = await fetchAndStorePackets();
    res.json(result);
});

setInterval(fetchAndStorePackets, 5 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
