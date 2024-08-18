// backend/models/Packet.js
const mongoose = require('mongoose');

const PacketSchema = new mongoose.Schema({
    raw: String,
    serverTime: Number,
    mode: String,
    freq: Number,
    sf: Number,
    bw: Number,
    cr: Number,
    satellite: String,
    norad: Number,
    id: String,
    satDisplayName: String,
    satPos: {
        lat: Number,
        lng: Number,
        alt: Number
    },
    stationNumber: Number,
});

module.exports = mongoose.model('Packet', PacketSchema);
