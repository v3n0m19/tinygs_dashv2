import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import axios from 'axios';
import * as satellite from 'satellite.js';

const SatelliteTracker = ({ satellite_name, globeOptions = {} }) => {
  const globeEl = useRef();
  
  const [tleData, setTleData] = useState(["","",""])
  const [satellitePosition, setSatellitePosition] = useState({lng:0,lat:0,alt:0});

  const [ringData, setRingData] = useState({lat: 0,
    lng: 0,
    maxR: 20,
    propagationSpeed: 2,
    repeatPeriod: 1000 })


    useEffect(() => {
        const fetchTleData = async () => {
          if (satellite_name) {
            try {
              const response = await axios.get(`/api/fetch-sat?name=${satellite_name}`);
              const satelliteData = response.data;
              if (satelliteData && satelliteData.tle) {
                setTleData(satelliteData.tle);
              }
            } catch (error) {
              console.error('Error fetching TLE data:', error);
            }
          }
        };
    
        fetchTleData();
      }, [satellite_name]);

  useEffect(() => {
    const satrec = satellite.twoline2satrec(tleData[1], tleData[2]);

    const calculatePosition = (satrec, time) => {
        const positionAndVelocity = satellite.propagate(satrec, time);
        const gmst = satellite.gstime(time);
        const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
        const longitude = satellite.degreesLong(positionGd.longitude);
        const latitude = satellite.degreesLat(positionGd.latitude);
        const height = positionGd.height/6371;

        return({ lat: latitude, lng: longitude, alt: height });
    }

    const calculateSatelliteData = () => {
      const currentTime = new Date();
      const currPos = calculatePosition(satrec, currentTime);

      setSatellitePosition({ lat: currPos.lat, lng: currPos.lng, alt: currPos.alt });
      setRingData({lat: currPos.lat, lng: currPos.lng, maxR: 15, propagationSpeed: 2, repeatPeriod: 2000})

    };

    calculateSatelliteData();

    const interval = setInterval(() => {
      calculateSatelliteData();
    }, 1000);

    return () => clearInterval(interval);
  }, [tleData]);
  
  const colorInterpolator = t => `rgba(255,100,50,${Math.sqrt(1-t)})`;

  return(
    <figure>
    <Globe
    ref={globeEl}
    globeImageUrl={globeOptions.globeImageUrl || "//unpkg.com/three-globe/example/img/earth-night.jpg"}
    bumpImageUrl={globeOptions.bumpImageUrl || "//unpkg.com/three-globe/example/img/earth-topology.png"}
    showAtmosphere={globeOptions.showAtmosphere !== undefined ? globeOptions.showAtmosphere : true}
    atmosphereAltitude={globeOptions.atmosphereAltitude || 0.15}

    ringsData={[ringData]}
    ringColor={() => colorInterpolator}
    ringMaxRadius="maxR"
    ringPropagationSpeed="propagationSpeed"
    ringRepeatPeriod="repeatPeriod"
 
    height="300"
    width="350"

    backgroundColor={globeOptions.backgroundColor || "#091319"}
  />    
  </figure>

  
)
};
export default SatelliteTracker;