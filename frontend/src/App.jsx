import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import StationCard from "./components/StationCard";
import SatelliteCard from "./components/SatelliteCard";
import ConfigTable from "./components/ConfigTable";

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
        <StationCard
          stationDetails={stationDetails}
          packetsToAdd={packetsToAdd}
          fetchData={fetchData}
          handleStorePackets={handleStorePackets}
          error={error}
        />
        <SatelliteCard
          stationDetails={stationDetails}
        />
        <ConfigTable
          modemConfig={modemConfig}
        />
      </div>
    </>
  );
}

export default App;
