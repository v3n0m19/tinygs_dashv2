import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SatelliteCard = ({ stationDetails }) => {
  const [imageSrc, setImageSrc] = useState('https://static.tinygs.com/satellites/generic_low.jpg');

  useEffect(() => {
    const fetchSatelliteData = async () => {
      if (stationDetails && stationDetails.satellite) {
        try {
          const response = await axios.get(`/api/fetch-sat?name=${stationDetails.satellite}`);
          const satelliteData = response.data;
          if (satelliteData && satelliteData.image) {
            setImageSrc(satelliteData.image);
          }
        } catch (error) {
          console.error('Error fetching satellite data:', error);
        }
      }
    };

    fetchSatelliteData();
  }, [stationDetails]);

  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl m-4 mx-5 mr-10 grow">
      <figure>
        <img src={imageSrc} alt="Sat" />
      </figure>
      <div className="card-body justify-center">
        <h1 className="card-title justify-center text-2xl text-blue-300">
          {stationDetails ? stationDetails.satellite : 'Unknown'}
        </h1>
      </div>
    </div>
  );
};

export default SatelliteCard;
