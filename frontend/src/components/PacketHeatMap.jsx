// components/PacketHeatMap.jsx
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; // Ensure default styles are included
import { Tooltip as ReactTooltip } from 'react-tooltip'
import axios from 'axios';

const PacketHeatMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/fetch-statistics');

        const transformedData = response.data;

        const latestDate = new Date(Math.max(...transformedData.map(entry => new Date(entry.date))));

        const startDate = new Date(latestDate);
        startDate.setMonth(latestDate.getMonth() - 4);

        const dateList = [];
        let currentDate = new Date(startDate);

        while (currentDate <= latestDate) {
          dateList.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const dateCountMap = transformedData.reduce((acc, { date, count }) => {
          acc[date] = count;
          return acc;
        }, {});

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
      <div className='relative'>
        <CalendarHeatmap
            startDate={new Date(new Date().setMonth(new Date().getMonth() - 4))} // 4 months ago
            endDate={new Date()}
            values={data}
            classForValue={(value) => {
                if (!value) {
                  return ;
                }
                if(value.count === 0){
                  return 'color-scale-0'
                }
                if (value.count >= 43) {
                  return 'color-scale-7'; // 43 - 49
                } else if (value.count >= 36) {
                  return 'color-scale-6'; // 36 - 42
                } else if (value.count >= 29) {
                  return 'color-scale-5'; // 29 - 35
                } else if (value.count >= 22) {
                  return 'color-scale-4'; // 22 - 28
                } else if (value.count >= 15) {
                  return 'color-scale-3'; // 15 - 21
                } else if (value.count >= 8) {
                  return 'color-scale-2'; // 8 - 14
                } else if(value.count >= 1){
                  return 'color-scale-1'; // 0 - 7
                }
                
              }}
              tooltipDataAttrs={(value) => {
                if(!value)
                  return;
                if (value) {
                  return {
                    'data-tooltip-id':'heatmap-tooltip',
                    'data-tooltip-content': `Date: ${value.date}, Packets: ${value.count}`
                  };
                }

              }}

 
        />
          <ReactTooltip id='heatmap-tooltip' style={{backgroundColor: '#091319',opacity:0.8, borderRadius:'6px'}}/>
        </div>
    </div>
  );
};

export default PacketHeatMap;
