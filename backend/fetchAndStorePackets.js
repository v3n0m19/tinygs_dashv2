const connectDB = require('./config/db');
const fetchAndStorePackets = require('./services/fetchAndStorePackets');

module.exports = async (req, res) => {
    try {
        await connectDB();
        await fetchAndStorePackets();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error fetching and storing packets:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
