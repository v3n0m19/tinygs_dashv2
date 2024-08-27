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
  const modemConfigData = response.data.configurations[0]; 
  return modemConfigData;
};

const updateSatellites = async () => {
  try {
    await axios.get("/api/update-sats");
    console.log("Satellites updated successfully.");
  } catch (error) {
    console.error("Error updating satellites:", error);
  }
};


const updateStatistics = async () => {
  try {
    await axios.get("/api/update-statistics");
    console.log("statistics updated successfully.");
  } catch (error) {
    console.error("Error updating statistics:", error);
  }
};

function App() {
  const [stationDetails, setStationDetails] = useState(null);
  const [modemConfig, setModemConfig] = useState({});
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

    updateTime();

    return () => clearInterval(interval); 
  },[]);

  const fetchData = async () => {
    try {
      await updateSatellites();
      await updateStatistics();
      const data = await fetchStationDetails();
      setStationDetails(data);

      if (data.satellite) {
        const modemConfigData = await fetchModemConfig(data.satellite);
        setModemConfig(modemConfigData);
      }

      setError(null);
    } catch (err) {
      console.log("Error fetching station details:", err);
      setError("Error fetching station details");
    }
  };


  useEffect(() => {
    fetchData(); 
  }, []);

  return (
    <>
      <NavBar
        time={time}
      />  
      <div className="flex flex-row justify-stretch">
        <StationCard
          stationDetails={stationDetails}
          fetchData={fetchData}
          error={error}
          setError={setError}
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
