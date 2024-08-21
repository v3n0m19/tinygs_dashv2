import React from 'react';
const SatelliteCard = ({ stationDetails}) => (
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
        
);
export default SatelliteCard;