import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const fetchStationDetails = async () => {
  const response = await axios.get(
    "https://api.tinygs.com/v1/station/ROXX_LoRa@731332067"
  );
  return response.data;
};

const storePackets = async () => {
  const response = await axios.get("http://localhost:5000/api/store-packets");//update before pushing to production
  return response.data;
};

function App() {
  const [stationDetails, setStationDetails] = useState(null);
  const [packetsToAdd, setPacketsToAdd] = useState(0);
  const [lastPacketCount, setLastPacketCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await fetchStationDetails();
      setStationDetails(data);

      if (lastPacketCount !== 0) {
        setPacketsToAdd(data.confirmedPackets - lastPacketCount);
      }
    } catch (err) {
      setError("Error fetching station details");
    }
  };

  const handleStorePackets = async () => {
    try {
      await storePackets();
      setLastPacketCount(stationDetails.confirmedPackets);
      setPacketsToAdd(0); // Reset the difference after storing packets
    } catch (err) {
      setError("Error storing packets");
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const modemConfig = stationDetails ? JSON.parse(stationDetails.modem_conf) : {};

  return (
    <>
      <div className="flex flex-row">
        <div className="card card-compact bg-base-300 w-96 shadow-xl px-2 py-4 m-4">
          <h2 className="card-title justify-center text-accent">
            Station Details:
          </h2>
          <div className="card-body">
            {error && <p className="text-red-500">{error}</p>}
            {stationDetails ? (
              <pre className="whitespace-pre-wrap p-1 rounded-md">
                <span className="text-[#55d1d9]">Name             :</span>{" "}
                <span className="text-[#f096b0]">{stationDetails.name}</span>
                <br />
                <span className="text-[#55d1d9]">User ID          :</span>{" "}
                <span className="text-[#f096b0]">{stationDetails.userId}</span>
                <br />
                <span className="text-[#55d1d9]">Location         :</span>{" "}
                <span className="text-[#f096b0]">
                  {stationDetails.location[0]}, {stationDetails.location[1]}
                </span>
                <br />
                <span className="text-[#55d1d9]">Elevation        :</span>{" "}
                <span className="text-[#f096b0]">
                  {stationDetails.elevation} meters
                </span>
                <br />
                <span className="text-[#55d1d9]">Antenna          :</span>{" "}
                <span className="text-[#f096b0]">{stationDetails.antenna}</span>
                <br />
                <span className="text-[#55d1d9]">Total Packets    :</span>{" "}
                <span className="text-[#f096b0]">
                  {stationDetails.confirmedPackets}
                </span>
                <br />
                <span className="text-[#55d1d9]">Last Packet Time :</span>{" "}
                <span className="text-[#f096b0]">
                  {new Date(stationDetails.lastPacketTime).toLocaleString(
                    "en-IN",
                    { hour12: false }
                  )}
                </span>
                <br />
                <span className="text-[#55d1d9]">Packets to Add   :</span>{" "}
                <span className="text-[#f096b0]">{packetsToAdd}</span>
              </pre>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="card-actions justify-between px-2">
            <button
              className="btn btn-md btn-outline btn-accent"
              onClick={fetchData}
            >
              Refresh Data
            </button>
            <button
              className="btn btn-md btn-outline btn-accent"
              onClick={handleStorePackets}
            >
              Store Packets
            </button>
          </div>
        </div>

        <div className="card card-compact bg-base-300 w-96 shadow-xl m-4">
          <figure>
            <img
              src="https://static.tinygs.com/satellites/generic_low.jpg"
              alt="Sat"
            />
          </figure>
          <div className="card-body justify-center">
            <h1 className="card-title justify-center text-2xl text-blue-300">{modemConfig.sat}</h1>
          </div>
        </div>

        <div className="stats stats-vertical bg-base-300 shadow my-4 ml-4 rounded-none">
          <div className="stat">
            <div className="stat-title">NORAD</div>
            <div className="stat-value text-blue-300">{modemConfig.NORAD}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Frequency</div>
            <div className="stat-value text-blue-300">
              {modemConfig.freq}MHz
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Mode</div>
            <div className="stat-value text-blue-300">{modemConfig.mode}</div>
          </div>
        </div>
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none">
          <div className="stat">
            <div className="stat-title">Spreading Factor</div>
            <div className="stat-value text-blue-300">{modemConfig.sf}MHz</div>
          </div>

          <div className="stat">
            <div className="stat-title">Bandwidth</div>
            <div className="stat-value text-blue-300">{modemConfig.bw}MHz</div>
          </div>

          <div className="stat">
            <div className="stat-title">Coding Rate</div>
            <div className="stat-value text-blue-300">{modemConfig.cr}</div>
          </div>
        </div>
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none">
          <div className="stat">
            <div className="stat-title">Syncword</div>
            <div className="stat-value text-blue-300">
              0x{modemConfig.sw ? modemConfig.sw.toString(16): 0}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">CRC</div>
            <div className="stat-value text-blue-300">
              {modemConfig.crc ? "Enabled" : "Disabled"}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Preamble Length</div>
            <div className="stat-value text-blue-300">
              {modemConfig.pl} symbols
            </div>
          </div>
        </div>
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none">
          <div className="stat">
            <div className="stat-title">TX Power</div>
            <div className="stat-value text-blue-300">
              {modemConfig.pwr} dBm
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Current Limit</div>
            <div className="stat-value text-blue-300">{modemConfig.cl} mA</div>
          </div>

          <div className="stat">
            <div className="stat-title">Gain</div>
            <div className="stat-value text-blue-300">
              {modemConfig.gain} dB
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
