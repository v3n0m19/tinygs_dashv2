// components/PacketHeatMap.jsx
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; // Ensure default styles are included

const PacketHeatMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetch-statistics');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Transform the data to fit the expected format
        const transformedData = result.map(entry => ({
          date: new Date(entry.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
          count: entry.packets
        }));

        // Determine the latest date
        const latestDate = new Date(Math.max(...transformedData.map(entry => new Date(entry.date))));

        // Determine the start date as 4 months before the latest date
        const startDate = new Date(latestDate);
        startDate.setMonth(latestDate.getMonth() - 4);

        // Generate a list of all dates from the start date to the latest date
        const dateList = [];
        let currentDate = new Date(startDate);

        while (currentDate <= latestDate) {
          dateList.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Create a map of date counts
        const dateCountMap = transformedData.reduce((acc, { date, count }) => {
          acc[date] = count;
          return acc;
        }, {});

        // Fill in missing dates with a count of 0
        const completeData = dateList.map(date => ({
          date,
          count: dateCountMap[date] || 0
        }));

        setData(completeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card shadow-lg bg-base-300 p-4 mx-4 my-4 grow">
      <h2 className="text-lg font-bold mb-4 text-center">Packet Heatmap</h2>
        <CalendarHeatmap
            startDate={new Date(new Date().setMonth(new Date().getMonth() - 4))} // 4 months ago
            endDate={new Date()}
            values={data}
            classForValue={(value) => {
                if (!value || value.count===0) {
                  return ;
                }
                if(value.count > 50)
                {return `color-scale-4`}
                else if(value.count > 40)
                {return `color-scale-3`}
                else if(value.count > 20)
                {
                    return `color-scale-2`
                }
                else if(value.count > 0)
                {
                    return `color-scale-1`
                }
                
              }}
 
        />
      
    </div>
  );
};

export default PacketHeatMap;
