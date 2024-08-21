import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const fetchStationDetails = async () => {
  const response = await axios.get(
    "https://api.tinygs.com/v1/station/ROXX_LoRa@731332067"
  );
  return response.data;
};

// Function to fetch packets from TinyGS and store them in the database
const storePackets = async () => {
  try {
    const fetchResponse = await axios.get("http://localhost:5000/api/fetch-packets-tinygs");
    
    if (fetchResponse.data.newPackets.length === 0) {
      console.log('No new packets to store.');
      return { success: true, message: 'No new packets to store.' };
    }

    const storeResponse = await axios.post("http://localhost:5000/api/store-packets-db", {
      packets: fetchResponse.data.newPackets
    });

    return storeResponse.data;
  } catch (error) {
    console.error('Failed to fetch and store packets:', error.message);
    return { success: false, error: error.message };
  }
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
      <div className="flex flex-row justify-stretch">
        <div className="card card-compact bg-base-300 w-96 shadow-xl px-2 py-4 m-4 mx-5 grow">
          <div className="card-title justify-left">
            {stationDetails ? (
              stationDetails.status === 1 ? (
                <>
                  <input
                    type="radio"
                    name="radio-4"
                    className="radio radio-success m-4"
                    defaultChecked
                  />
                  <h1 className="text-4xl text-success">Online</h1>
                </>
              ) : (
                <>
                  <input
                    type="radio"
                    name="radio-4"
                    className="radio radio-error m-4"
                    defaultChecked
                  />
                  <h1 className="text-4xl text-error">Offline</h1>
                </>
              )
            ) : (
              <span className="loading loading-dots loading-md mx-5"></span>
            )}
          </div>
          <div className="card-body">
            {error && <p className="text-red-500">{error}</p>}
            {stationDetails ? (
              <pre className="whitespace-pre-wrap p-1 rounded-md">
                <span className="text-[#55d1d9]">Name :</span>{" "}
                <span className="text-[#f096b0]">{stationDetails.name}</span>
                <br />
                <span className="text-[#55d1d9]">User ID :</span>{" "}
                <span className="text-[#f096b0]">{stationDetails.userId}</span>
                <br />
                <span className="text-[#55d1d9]">Location :</span>{" "}
                <span className="text-[#f096b0]">
                  {stationDetails.location[0]}, {stationDetails.location[1]}
                </span>
                <br />
                <span className="text-[#55d1d9]">Elevation :</span>{" "}
                <span className="text-[#f096b0]">
                  {stationDetails.elevation} meters
                </span>
                <br />
                <span className="text-[#55d1d9]">Antenna :</span>{" "}
                <span className="text-[#f096b0]">{stationDetails.antenna}</span>
                <br />
                <span className="text-[#55d1d9]">Total Packets :</span>{" "}
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
                <span className="text-[#55d1d9]">Packets to Add :</span>{" "}
                <span className="text-[#f096b0]">{packetsToAdd}</span>
              </pre>
            ) : (
              <span className="loading loading-spinner loading-lg mx-36 my-10"></span>
            )}
          </div>
          <div className="card-actions justify-between px-4 py-2">
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

        <div className="card card-compact bg-base-300 w-96 shadow-xl m-4 mx-5 mr-10 grow">
          <figure>
            <img
              src="https://static.tinygs.com/satellites/generic_low.jpg"
              alt="Sat"
            />
          </figure>
          <div className="card-body justify-center">
            <h1 className="card-title justify-center text-2xl text-blue-300">
              {stationDetails ? stationDetails.satellite : "Unknown"}
            </h1>
          </div>
        </div>
        
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none  grow">
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
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none grow">
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
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none grow">
          <div className="stat">
            <div className="stat-title">Syncword</div>
            <div className="stat-value text-blue-300">
              0x{modemConfig.sw ? modemConfig.sw.toString(16) : 0}
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
        <div className="stats stats-vertical bg-base-300 shadow my-4 rounded-none mr-4 grow">
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
