import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

function PacketChart() {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/fetch-sats");
        const filteredData = response.data
          .filter(sat => sat.noOfPackets > 0) // Only include satellites with packets > 0
          .map(sat => ({
            name: sat.displayName, 
            noOfPackets: sat.noOfPackets 
          }));

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className ="card  card-compact bg-base-300 mx-4 my-4 grow" style={{ width: '40%', height: '450px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 100 }}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: '#333', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar
            dataKey="noOfPackets"
            fill="#9b75d9"
            onMouseEnter={handleMouseEnter}
            radius={[5, 5, 0, 0]}
          >
            {data.map((entry, index) => (
              <cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#82ca9d" : "#9b75d9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PacketChart;
