import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
// const dotenv = require('dotenv');

const fetchStationDetails = async () => {
  const response = await axios.get(
    "https://api.tinygs.com/v1/station/ROXX_LoRa@731332067"
  );
  return response.data;
};

const storePackets = async () => {
  const response = await axios.get("/api/store-packets");//update before pushing to production
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

  return (
    <>
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
              <span className="text-[#55d1d9]">Packets to Add   :</span>{" "}
              <span className="text-[#f096b0]">
                {packetsToAdd}
              </span>
              <br />
              <span className="text-[#55d1d9]">Last Packet Time :</span>{" "}
              <span className="text-[#f096b0]">
                {new Date(stationDetails.lastPacketTime).toLocaleString()}
              </span>
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
    </>
  );
}

export default App;
