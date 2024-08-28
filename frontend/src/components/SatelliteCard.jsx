import React, { useState, useEffect } from "react";
import axios from "axios";
import SatelliteTracker from "./SatelliteTracker";

const globeOptions = {
  globeImageUrl: "/api/proxy-image",
  pathColor: "rgba(0, 255, 0, 0.7)",
  pointColor: "yellow",
  backgroundColor: "#091319"
};

const SatelliteCard = ({ stationDetails }) => {
  const [imageSrc, setImageSrc] = useState(
    "https://static.tinygs.com/satellites/generic_low.jpg"
  );

  useEffect(() => {
    const fetchSatelliteData = async () => {
      if (stationDetails && stationDetails.satellite) {
        try {
          const response = await axios.get(
            `/api/fetch-sat?name=${stationDetails.satellite}`
          );
          const satelliteData = response.data;
          if (satelliteData && satelliteData.image) {
            setImageSrc(satelliteData.image);
          }
        } catch (error) {
          console.error("Error fetching satellite data:", error);
        }
      }
    };

    fetchSatelliteData();
  }, [stationDetails]);

  return (
    <div className="card card-compact bg-base-300 w-64 h-[23rem] shadow-xl m-4 mx-5 mr-10 grow">


      <div className="carousel w-full h-full">
        <div id="slide1" className="carousel-item relative w-full">
        <figure>
            <img src={imageSrc} alt="Sat" className="mr-1"/>
          </figure>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-xs">
              ❮
            </a>
            <a href="#slide2" className="btn btn-xs">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
        <figure className="ml-1 p-1">
        <SatelliteTracker className=""satellite_name={stationDetails ? stationDetails.satellite : "Unknown"} globeOptions={globeOptions} />

        </figure>

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-xs">
              ❮
            </a>
            <a href="#slide1" className="btn btn-xs">
              ❯
            </a>
          </div>
        </div>
        
      </div>

      <h1 className="card-title justify-center text-2xl text-blue-300 p-2 pb-4">
        {stationDetails ? stationDetails.satellite : "Unknown"}
      </h1>
    </div>
  );
};

export default SatelliteCard;
