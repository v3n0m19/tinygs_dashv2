import React from "react";
import axios from "axios";

const storePackets = async (packets) => {
  try {
    if (packets.length === 0) {
      console.log('No new packets to store.');
      return { success: true, message: 'No new packets to store.' };
    }
    const storeResponse = await axios.post("/api/store-packets-db", {
      packets
    });

    return storeResponse.data;
  } catch (error) {
    console.error('Failed to fetch and store packets:', error.message);
    return { success: false, error: error.message };
  }
};

const StationCard = ({
  stationDetails,
  fetchData,
  backgroundPackets,
  noOfPackets,
  error,
  setError,
}) => {

  const handleStorePackets = async () => {
    try {
      await storePackets(backgroundPackets);
      setError(null);
    } catch (err) {
      console.log("Error storing packets:", err);
      setError("Error storing packets");
    }
  };


  return (
    <div className="card card-compact w-96 bg-base-300 shadow-xl px-2 py-4 m-4 mx-5 grow">
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
            <span className="text-info">Name              :</span>{" "}
            <span className="text-secondary">{stationDetails.name}</span>
            <br />
            <span className="text-info">User ID           :</span>{" "}
            <span className="text-secondary">{stationDetails.userId}</span>
            <br />
            <span className="text-info">Location          :</span>{" "}
            <span className="text-secondary">
              {stationDetails.location[0]}, {stationDetails.location[1]}
            </span>
            <br />
            <span className="text-info">Elevation         :</span>{" "}
            <span className="text-secondary">
              {stationDetails.elevation} meters
            </span>
            <br />
            <span className="text-info">Antenna           :</span>{" "}
            <span className="text-secondary">{stationDetails.antenna}</span>
            <br />
            <span className="text-info">Total Packets     :</span>{" "}
            <span className="text-secondary">
              {stationDetails.confirmedPackets}
            </span>
            <br />
            <span className="text-info">Last Packet Time  :</span>{" "}
            <span className="text-secondary">
              {new Date(stationDetails.lastPacketTime).toLocaleString("en-IN", {
                hour12: false,
              })}
            </span>
            <br />
            <span className="text-info">Packets to Store  :</span>{" "}
            <span className="text-secondary">
              {noOfPackets}
            </span>
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
  );
};

export default StationCard;
