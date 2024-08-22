import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import StationCard from "./components/StationCard";
import SatelliteCard from "./components/SatelliteCard";
import ConfigTable from "./components/ConfigTable";
import NavBar from "./components/NavBar";
import PacketChart from "./components/PacketChart";
import PacketHeatMap from "./components/PacketHeatMap";

const fetchStationDetails = async () => {
  const response = await axios.get(
    "https://api.tinygs.com/v1/station/ROXX_LoRa@731332067"
  );
  return response.data;
};

const fetchModemConfig = async (satelliteName) => {
  const response = await axios.get(
    `/api/fetch-sat?name=${satelliteName}`
  );
  const modemConfigData = response.data.configurations[0]; // Extract the first configuration
  return modemConfigData;
};

// Function to fetch packets from TinyGS and store them in the database
const storePackets = async () => {
  try {
    const fetchResponse = await axios.get("/api/fetch-packets-tinygs");
    
    if (fetchResponse.data.newPackets.length === 0) {
      console.log('No new packets to store.');
      return { success: true, message: 'No new packets to store.' };
    }

    const storeResponse = await axios.post("/api/store-packets-db", {
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
  const [modemConfig, setModemConfig] = useState({});
  const [packetsToAdd, setPacketsToAdd] = useState(0);
  const [lastPacketCount, setLastPacketCount] = useState(0);
  const [error, setError] = useState(null);
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTime({ hours, minutes, seconds });
    };

    const interval = setInterval(updateTime, 1000);

    // Initialize the clock immediately
    updateTime();

    return () => clearInterval(interval); // Cleanup interval on component unmount
  },[]);

  const fetchData = async () => {
    try {
      const data = await fetchStationDetails();
      setStationDetails(data);

      if (data.satellite) {
        const modemConfigData = await fetchModemConfig(data.satellite);
        setModemConfig(modemConfigData);
      }

      if (lastPacketCount !== 0) {
        setPacketsToAdd(data.confirmedPackets - lastPacketCount);
      }

      setError(null);
    } catch (err) {
      console.log("Error fetching station details:", err);
      setError("Error fetching station details");
    }
  };

  const handleStorePackets = async () => {
    try {
      await storePackets();
      setLastPacketCount(stationDetails.confirmedPackets);
      setPacketsToAdd(0); // Reset the difference after storing packets

      setError(null);
    } catch (err) {
      console.log("Error storing packets:",);
      setError("Error storing packets");
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  return (
    <>
      <NavBar
        time={time}
      />  
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
      <div className="flex flex-row justify-stretch h-1/3">
      <PacketChart />
      <PacketHeatMap/>
      </div>

    </>
  );
}

export default App;
